from django.db import models
from login.models import User
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class Perfil(models.Model):
    username = models.ForeignKey(User,on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    interested_cryptos = ArrayField(models.CharField(max_length=200, default=list))
    description = models.CharField(max_length=300)
    date_joined = models.DateTimeField()

    def __str__(self) -> str:
        return  self.name 

    class Meta:
        verbose_name_plural = 'Perfil'