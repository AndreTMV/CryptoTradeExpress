from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils.timezone import localtime
from .models import ChatMessage

User = get_user_model()


def dm_room_key(a_id: int, b_id: int) -> str:
    a, b = sorted([int(a_id), int(b_id)])
    return f"dm_{a}_{b}"


def serialize_message(m: ChatMessage) -> dict:
    return {
        "id": m.id,
        "user": m.user_id,         # mantengo tu campo
        "sender": m.sender_id,
        "receiver": m.receiver_id,
        "message": m.message,
        "is_read": m.is_read,
        "date": localtime(m.date).isoformat(),
    }


class DMConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket por conversación (DM) entre self.user y peer_id.
    URL: ws://.../ws/chat/dm/<peer_id>/?token=JWT
    Eventos:
      - C->S: {"type":"message","text":"hola"}
      - C->S: {"type":"fetch_history","limit":50,"before_id":123}
      - C->S: {"type":"typing","isTyping":true}
      - C->S: {"type":"read"}  # marca recibidos como leídos
      - S->C: {"type":"message","payload":{...}}
      - S->C: {"type":"history","payload":[...]}
      - S->C: {"type":"typing","payload":{"user":<id>,"isTyping":true}}
      - S->C: {"type":"read","payload":{"reader":<id>}}
      - S->C: {"type":"error","error":"..."}
    """

    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return

        try:
            self.peer_id = int(self.scope["url_route"]["kwargs"]["peer_id"])
        except Exception:
            await self.close(code=4002)
            return

        if self.peer_id == user.id:
            await self.close(code=4003)
            return

        exists = await self._user_exists(self.peer_id)
        if not exists:
            await self.close(code=4004)
            return

        self.user = user
        self.room_group_name = dm_room_key(self.user.id, self.peer_id)

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        t = content.get("type")
        if t == "message":
            text = (content.get("text") or "").strip()
            if not text:
                return
            if len(text) > 10000:
                text = text[:10000]
            msg = await self._create_message(text)
            # broadcast al grupo
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "chat.event", "event": "message", "payload": msg},
            )

        elif t == "fetch_history":
            limit = int(content.get("limit", 50))
            before_id = content.get("before_id")
            history = await self._fetch_history(limit, before_id)
            await self.send_json({"type": "history", "payload": history})

        elif t == "typing":
            is_typing = bool(content.get("isTyping", True))
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat.event",
                    "event": "typing",
                    "payload": {"user": self.user.id, "isTyping": is_typing},
                },
            )

        elif t == "read":
            await self._mark_read()
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "chat.event", "event": "read",
                    "payload": {"reader": self.user.id}},
            )

        else:
            await self.send_json({"type": "error", "error": "unknown_type"})

    async def chat_event(self, event):
        # Enviar a socket
        await self.send_json({"type": event["event"], "payload": event.get("payload")})

    # -------- DB ops (sync envueltos) --------
    @database_sync_to_async
    def _user_exists(self, uid: int) -> bool:
        return User.objects.filter(id=uid).exists()

    @database_sync_to_async
    def _create_message(self, text: str) -> dict:
        sender = self.user
        receiver = User.objects.get(id=self.peer_id)
        msg = ChatMessage.objects.create(
            user=sender,           # respetando tu modelo
            sender=sender,
            receiver=receiver,
            message=text,
        )
        return serialize_message(msg)

    @database_sync_to_async
    def _fetch_history(self, limit: int, before_id):
        qs = ChatMessage.objects.filter(
            sender_id__in=[self.user.id, self.peer_id],
            receiver_id__in=[self.user.id, self.peer_id],
        ).order_by("-id")
        if before_id:
            qs = qs.filter(id__lt=before_id)
        items = list(qs[: max(1, min(limit, 200))])
        # devolver ascendente por fecha
        items.reverse()
        return [serialize_message(m) for m in items]

    @database_sync_to_async
    def _mark_read(self):
        ChatMessage.objects.filter(
            sender_id=self.peer_id, receiver_id=self.user.id, is_read=False
        ).update(is_read=True)

