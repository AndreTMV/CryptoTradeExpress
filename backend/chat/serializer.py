from rest_framework import serializers
from .models import ChatMessage
from perfil.serializer import PerfilSerializer

class ChatMessageSerializer(serializers.ModelSerializer):
    receiver_profile = PerfilSerializer(read_only=True)
    sender_profile = PerfilSerializer(read_only=True)
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'sender', 'sender_profile', 'receiver', 'receiver_profile','message', 'is_read', 'date'] 