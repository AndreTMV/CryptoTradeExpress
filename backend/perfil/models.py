from django.db import models
from login.models import User
from django.contrib.postgres.fields import ArrayField
from amigos.models import FriendList
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from videos.models import Video

# Create your models here.
class Perfil(models.Model):
    HIDE_DATA =(
        ('name', 'name'),
        ('interested_cryptos', 'interested_cryptos'),
        ('description', 'description'),
        ('date_joined', 'date_joined'),
        ('friend_list', 'friend_list'),
        ('videos_calification', 'videos_calification'),
        ('birth_day', 'birth_day'),
    )
    username = models.ForeignKey(User,on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    interested_cryptos = ArrayField(models.CharField(max_length=200, default=list))
    description = models.CharField(max_length=300)
    date_joined = models.DateTimeField(auto_now_add=True, null=True)
    birth_day = models.DateField(null=True)
    friend_list = models.ForeignKey(FriendList, on_delete=models.CASCADE, null=True)
    videos_calification = models.FloatField(null=True)
    hide_information = ArrayField(models.CharField(max_length=200, default=list, choices=HIDE_DATA, null=True), null=True)

    def __str__(self) -> str:
        return  self.name 

    class Meta:
        verbose_name_plural = 'Perfil'

@receiver(pre_save, sender=Perfil)
def save(sender, instance, *args, **kwargs):
    instance.hide_information = list(set(instance.hide_information))
    videos = Video.objects.filter(username=instance.username)
    media_calification = 0
    if instance.videos_calification is None:
        if len(videos) > 0:
            for video in videos:
                calification = video.stars / video.views
                media_calification += calification
            media_calification /= len(videos)
            instance.videos_calification = media_calification
        else:
            instance.videos_calification = 0.0
    if instance.friend_list is None:
        friend_list = FriendList.objects.get(user=instance.username)
        instance.friend_list = friend_list



class ExcludedRecomendations(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    excluded_recomendations = ArrayField(models.IntegerField(), null=True)

@receiver(post_save, sender=Perfil)
def save_recomendations(sender, instance, *args, **kwargs):
    recomendations = ExcludedRecomendations(
        user = instance.username,
        excluded_recomendations = []
    )
    recomendations.save()