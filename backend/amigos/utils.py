from .models import FriendRequest

def get_friend_request_or_false(receiver, sender):
    try:
        return FriendRequest.objects.get( sender=sender, receiver=receiver,is_active=True)
    except FriendRequest.DoesNotExist:
        return False
      