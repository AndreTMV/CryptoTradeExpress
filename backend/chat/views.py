from django.shortcuts import render
from django.db.models import Subquery,OuterRef, Q
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets, status, generics
from .serializer import ChatMessageSerializer
from .models import ChatMessage 
from login.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from perfil.models import Perfil
from perfil.serializer import PerfilSerializer


# Create your views here.
def index(request):
    return render(request, "chat/index.html")

class ChatMessageView(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    queryset = ChatMessage.objects.all()

class MyInbox(generics.ListAPIView):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        messages = ChatMessage.objects.filter(
            id__in = Subquery(
                User.objects.filter(
                    Q(sender__receiver =user_id)|
                    Q(receiver__sender=user_id)
                ).distinct().annotate(
                    last_msg = Subquery(
                        ChatMessage.objects.filter(
                            Q(sender=OuterRef('id'), receiver=user_id)|
                            Q(receiver=OuterRef('id'), sender=user_id)
                        ).order_by('-id')[:1].values_list("id", flat=True)
                    )
                ).values_list('last_msg', flat=True).order_by("-id")
            )
        ).order_by("-id")

        return messages

class GetMessages(generics.ListAPIView):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        messages = ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id],
            receiver__in=[sender_id, receiver_id]
        )

        return messages

class SendMessage(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer

class SearchUser(generics.ListAPIView):
    serializer_class = PerfilSerializer
    queryset = Perfil.objects.all()

    def list(self, req, *args, **kwargs):
        username = self.kwargs['username']
        logged_in_user = self.request.user
        users = Perfil.objects.filter(
            Q(username__username__icontains=username) |
            Q(name__icontains=username) |
            Q(username__email__icontains=username) 
        )
        
        if not users.exists():
            return Response(
                {"Detail":"No users found"},
                status=404
            )

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

def room(request, room_name):
    return render(request, "chat/room.html", {
        "room_name": room_name,
        'username': request.user.username,

        }
    )
