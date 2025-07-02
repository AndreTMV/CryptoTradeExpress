from rest_framework import serializers
from .models import FriendList, FriendRequest

class FriendListSerializer(serializers.ModelSerializer):
    friends_count = serializers.SerializerMethodField()

    class Meta:
        model = FriendList
        fields = ('friends_count','user','friends')

    def get_friends_count(self, obj):
        return obj.friends.count()


class FriendRequestSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = FriendRequest
        fields = ['id', 'is_active', 'timestamp', 'sender', 'sender_username', 'receiver', 'receiver_username']
