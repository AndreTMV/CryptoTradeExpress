import json

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage
from .views import GetMessages, SendMessage


class ChatConsumer(AsyncWebsocketConsumer):

    async def fetch_messages(self,data):
        messages = GetMessages(data)
        content = {
            'command':'fetch_messages',
            'messages':self.messages_to_json(messages)
        }
        await self.send_chat_message(content)

    async def new_message(self, data):
        message = SendMessage(data)
        content = {
            'command':'new_message',
            'content':message
        }
        await self.send_chat_message(content)



    def messages_to_json(self,messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self,message):
        return {
            'user':message.user,
            'sender':message.sender,
            'receiver':message.receiver,
            'message':message.message,
            'is_read':message.is_read,
            'date':str(message.date)
        }

    commands = {
        'fetch_messages':fetch_messages,
        'new_message':new_message,
    }

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self,data)

    async def send_chat_message(self,message):

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", "message": message}
        )

    async def send_message(self,message):
        await self.send(text_data=json.dumps(message))

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))