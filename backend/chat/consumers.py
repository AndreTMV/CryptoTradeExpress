import json

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage
from .views import GetMessages, SendMessage

class ChatConsumer(AsyncWebsocketConsumer):

    async def fetch_messages(self, data):
        sender_id = data['sender_id']
        receiver_id = data['receiver_id']
        messages = GetMessages().get_queryset(sender_id, receiver_id)
        content = {
            'command': 'fetch_messages',
            'messages': self.messages_to_json(messages)
        }
        await self.send_message(content)


    async def new_message(self, data):
        message = SendMessage().create(self.scope['user'], data['receiver_id'], data['message'])
        content = {
            'command': 'new_message',
            'content': self.message_to_json(message)
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

    # async def connect(self):
    #     self.sender_id = self.scope['url_route']['kwargs']['sender_id']
    #     self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']

    #     # Create a unique room name based on sender and receiver IDs
    #     self.room_name = f"chat_{self.sender_id}_{self.receiver_id}"

    #     # Join room group
    #     await self.channel_layer.group_add(self.room_name, self.channel_name)

    #     await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        # await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        pass

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self,data)

    async def send_chat_message(self,message):

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    async def send_message(self,message):
        await self.send(text_data=json.dumps(message))

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))