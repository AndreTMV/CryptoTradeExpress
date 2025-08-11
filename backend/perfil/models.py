from django.db import models
from login.models import User
from django.contrib.postgres.fields import ArrayField
from amigos.models import FriendList
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from videos.models import Video

# Create your models here.


class Perfil(models.Model):
    HIDE_DATA = (
        ('name', 'name'),
        ('interested_cryptos', 'interested_cryptos'),
        ('description', 'description'),
        ('date_joined', 'date_joined'),
        ('friend_list', 'friend_list'),
        ('videos_calification', 'videos_calification'),
        ('birth_day', 'birth_day'),
    )
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    interested_cryptos = ArrayField(
        models.CharField(max_length=200, default=list))
    description = models.CharField(max_length=300)
    date_joined = models.DateTimeField(auto_now_add=True, null=True)
    birth_day = models.DateField(null=True)
    friend_list = models.ForeignKey(
        FriendList, on_delete=models.CASCADE, null=True)
    videos_calification = models.FloatField(null=True)
    hide_information = ArrayField(
        base_field=models.CharField(max_length=200, choices=HIDE_DATA),
        default=list,
        blank=True,
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = 'Perfil'


@receiver(pre_save, sender=Perfil)
def perfil_pre_save(sender, instance, **kwargs):
    items = instance.hide_information or []
    instance.hide_information = list(set(items))

    videos = Video.objects.filter(username=instance.username)
    if instance.videos_calification is None:
        total = 0.0
        n = 0
        for v in videos:
            views = v.views or 0
            stars = v.stars or 0
            if views > 0:
                total += stars / views
                n += 1
        instance.videos_calification = total / n if n else 0.0

    if instance.friend_list_id is None:
        from amigos.models import FriendList
        fl, _ = FriendList.objects.get_or_create(user=instance.username)
        instance.friend_list = fl


class ExcludedRecomendations(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    excluded_recomendations = ArrayField(models.IntegerField(), null=True)


@receiver(post_save, sender=Perfil)
def save_recomendations(sender, instance, created, **kwargs):
    if created:
        ExcludedRecomendations.objects.get_or_create(
            user=instance.username, defaults={"excluded_recomendations": []}
        )

