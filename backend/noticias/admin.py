from django.contrib import admin
from .models import Noticia, CryptosTrending

# Register your models here.
class NoticiaAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'news', 'likes', 'retweets', 'comments', 'views', 'crypto', 'date_fetched', 'compound')

class CryptosTrendingAdmin(admin.ModelAdmin):
    list_display = ('cryptos', 'date_fetched')

admin.site.register(Noticia, NoticiaAdmin)
admin.site.register(CryptosTrending, CryptosTrendingAdmin)