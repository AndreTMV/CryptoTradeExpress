from django.shortcuts import render
from rest_framework.response import Response 
from rest_framework.decorators import api_view
from .models import FriendRequest, FriendList
from login.models import User
from .serializer import FriendRequestSerializer
from django.http import JsonResponse
from .utils import get_friend_request_or_false

# Create your views here.

@api_view(['GET'])
def are_friends(request):
    user_id = request.query_params.get('user')
    user_this = request.query_params.get('see_user')
    if user_id and user_this:
        try:
            this_user = User.objects.get(pk=user_id)
            user_auth = User.objects.get(pk=user_this)
            if not this_user or not user_auth:
                raise Exception('User not found') 
        except Exception as e:
            return Response({'status': str(e)}, status=404)
        
        try:
            friend_list = FriendList.objects.get(user=this_user)
        except friend_list.DoesNotExist:
            return Response({"friends":False}, status=200)
        
        if user_auth != this_user:
            if not user_auth in friend_list.friends.all():
                return Response({"friends":False}, status=200)
            else:
                return Response({"friends":True}, status=200)
        else:
            return Response({"status": "The users are the same"}, status=200)

    else:
        return Response({'status': 'most provide a valid users'}, status=500)

@api_view(['GET'])
def fetch_friends(request):
    user_id = request.query_params.get('user')
    user_this = request.query_params.get('see_user')
    if user_id and user_this:
        try:
            this_user = User.objects.get(pk=user_id)
            user_auth = User.objects.get(pk=user_this)
            if not this_user or not user_auth:
                raise Exception('User not found') 
        except Exception as e:
            return Response({'status': str(e)}, status=404)
        
        try:
            friend_list = FriendList.objects.get(user=this_user)
        except friend_list.DoesNotExist:
            return Response({'status': 'No friend list found'}, status=404)
        
        if user_auth != this_user:
            if not user_auth in friend_list.friends.all():
                return Response({'status':'must be friends to see the friend list'}, status=500)
        
        friends = []
        auth_user_friend_list = FriendList.objects.get(user=user_auth)
        for friend in friend_list.friends.all():
            if friend.username == user_auth.username:
                continue
            else:
                friends.append({
                    'id':friend.id,
                    'friend': friend.username,
                    'is_mutual_friend': auth_user_friend_list.is_mutual_friend(friend)
                })
        return JsonResponse(friends, safe=False, status=200)
    else:
        return Response({'status': 'most provide a valid users'}, status=500)



@api_view(['GET'])
def fetch_friend_requests(request):
    user_id = request.query_params.get('user')
    if user_id:
        user = User.objects.get(id=user_id)
        friend_requests = FriendRequest.objects.filter(receiver=user, is_active=True)
        if friend_requests:
            serializer = FriendRequestSerializer(friend_requests, many=True)
            return Response(serializer.data, status=200)
        else:
            return Response({'status': 'no friend requests'}, status=200)
    else:
        return Response({'status': 'most provide a valid user id'}, status=500)



@api_view(['POST'])
def send_friend_request(request):
    user_sender = request.data.get('user')
    user_id = request.data.get('receiver_user_id')
    if user_id and user_sender:
        user = User.objects.get(id=user_sender)
        receiver = User.objects.get(id=user_id)
        try:
            friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver)
            try:
                for request in friend_requests:
                   if request.is_active:
                      raise Exception("You already sent a friend request")
                friend_request = FriendRequest(sender=user,receiver=receiver)
                friend_request.save()
                return Response({'status': 'friend request sent successfully'}, status=200)
            except Exception as e:
                return Response({'status': str(e)}, status=500)
        except FriendRequest.DoesNotExist:
            friend_request = FriendRequest(sender=user,receiver=receiver)
            friend_request.save()
            return Response({'status': 'friend request sent successfully'}, status=200)
    else:
        return Response({'status': 'most provide a valid receiver id'}, status=500)

@api_view(['GET'])
def accept_friend_request(request):
    user_id = request.query_params.get('user')
    friend_request_id = request.query_params.get('friend_request_id')
    if user_id and friend_request_id:
        user = User.objects.get(pk=user_id)
        friend_request = FriendRequest.objects.get(pk=friend_request_id)
        if friend_request.receiver == user:
            if friend_request:
                friend_request.accept()
                return Response({'status': 'friend request accepted'}, status=200)
            else:
                return Response({'status': 'something went wrong'}, status=500)
        else:
            return Response({'status': 'that is not your request to accept'}, status=500)
    else:
        return Response({'status': 'most provide a valid parameters'}, status=500)

@api_view(['POST'])
def remove_friend(request):
    user_id = request.data.get('user')
    removee_id = request.data.get('receiver_id')
    if user_id and removee_id:
        try:
            user = User.objects.get(pk=user_id)
            removee = User.objects.get(pk=removee_id)
            friend_list = FriendList.objects.get(user=user)
            friend_list.unfriend(removee)
            return Response({'status': 'unfriend succesfully'}, status=200)
        except Exception as e:
            return Response({'status': str(e)}, status=500)
    else:
        return Response({'status': 'most provide a valid id'}, status=500)

@api_view(['GET'])
def decline_friend_request(request):
    user_id = request.query_params.get('user')
    friend_request_id = request.query_params.get('friend_request_id')
    if user_id and friend_request_id:
        friend_request = FriendRequest.objects.get(pk=friend_request_id)
        user = User.objects.get(pk=user_id)
        if friend_request.receiver == user:
            if friend_request:
                friend_request.decline()
                return Response({'status': 'friend request declined'}, status=200)
            else:
                return Response({'status': 'something went wrong'}, status=500)
        else:
            return Response({'status': 'that is not your request to decline'}, status=500)
    else:
        return Response({'status': 'most provide a valid parameters'}, status=500)

@api_view(['POST'])
def cancel_friend_request(request):
    user_id = request.data.get('user')
    receiver_id = request.data.get('receiver_id')
    if user_id and receiver_id:
        user = User.objects.get(pk=user_id)
        receiver = User.objects.get(pk=receiver_id)
        try:
            friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver, is_active=True)
            if not friend_requests:
                raise Exception("no friend requests")
        except Exception as e:
            return Response({'status': 'Nothing to cancel, friend request does not exist'}, status=500)
        
        if len(friend_requests) > 1:
            for request in friend_requests:
                request.cancel()
            return Response({'status': 'Friend request cancelled'}, status=200)
        else:
            friend_requests.first().cancel()
            return Response({'status': 'Friend request cancelled'}, status=200)           
    else:
        return Response({'status': 'most provide a valid parameters'}, status=500)

@api_view(['GET'])
def friend_request_exists(request):
    user_id = request.query_params.get('user')
    receiver_id = request.query_params.get('receiver')
    if user_id and receiver_id:
        try:
            user = User.objects.get(pk=user_id)
            receiver = User.objects.get(pk=receiver_id)
            if not user or not receiver:
                raise Exception('User not found') 
        except Exception as e:
            return Response({'status': str(e)}, status=404)
        
        if get_friend_request_or_false(receiver, user):
            return Response({'status': True})
        else:
            return Response({'status':False})
    else:
        return Response({'status': 'most provide a valid parameters'}, status=500)
