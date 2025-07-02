from django.contrib import admin

# Register your models here.
from .models import Perfil, ExcludedRecomendations

class PerfilAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'name', 'interested_cryptos','description','date_joined', 'birth_day', 'friend_list', 'videos_calification', 'hide_information')

class ExcludedRecomendationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'excluded_recomendations')

admin.site.register(Perfil, PerfilAdmin)
admin.site.register(ExcludedRecomendations, ExcludedRecomendationsAdmin)