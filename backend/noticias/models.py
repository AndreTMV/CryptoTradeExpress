from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Noticia(models.Model):
    user = models.CharField(max_length=200)
    date = models.DateTimeField()
    news = models.CharField(max_length=300)
    likes = models.IntegerField()
    retweets = models.IntegerField()
    comments = models.IntegerField()
    views = models.IntegerField()
    crypto = models.CharField(max_length=200)
    compound = models.FloatField(null=True, blank=True)
    date_fetched = models.DateField(auto_now_add=True, null=True, blank=True)

class CryptosTrending(models.Model):
    cryptos = ArrayField(models.CharField(max_length=200, default=list))
    date_fetched = models.DateTimeField()