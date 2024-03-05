from django.db import models
from login.models import User
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
# Create your models here.
class Section(models.Model):
    name = models.CharField(max_length=200)

class Video(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField()
    views = models.IntegerField(null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    stars = models.IntegerField(null=True)
    title = models.CharField(max_length=200)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, default=None)
    accepted = models.BooleanField(default=False)


    def __str__(self) -> str:
        return f"{self.title}: {self.url}" 



class Eliminated_Video(models.Model):
    video_id = models.IntegerField()      
    title = models.CharField(max_length=200)
    url = models.URLField()

@receiver(post_delete, sender=Video)
def video_delete(sender, instance, **kwargs):
    eliminated_video = Eliminated_Video(
        video_id=instance.id,
        title=instance.title,
        url=instance.url
    )
    eliminated_video.save()

@receiver(pre_save, sender=Video)
def save(sender, instance, *args, **kwargs):
    if instance.views is None:
        instance.views = 0
    if instance.stars is None:
        instance.stars = 0