from django.contrib import admin

# Register your models here.
from .models import Perfil

class PerfilAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'name', 'interested_cryptos','description','date_joined')

admin.site.register(Perfil, PerfilAdmin)