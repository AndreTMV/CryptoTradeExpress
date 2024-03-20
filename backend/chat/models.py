from django.db import models
from login.models import User 
from perfil.models import Perfil

# Create your models here.
class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")

    message = models.CharField(max_length=10000)
    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']
        verbose_name_plural = "Message"

    def __str__(self) -> str:
        return f"{self.sender} - {self.receiver}"

    @property
    def sender_profile(self):
        sender_profile = Perfil.objects.get(username = self.sender) 
        return sender_profile

    @property
    def receiver_profile(self):
        receiver_profile = Perfil.objects.get(username = self.receiver) 
        return receiver_profile