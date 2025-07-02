from django.contrib import admin
from .models import FriendList, FriendRequest

# Register your models here.

class FriendListAdmin(admin.ModelAdmin):
    list_filter = ['user']
    list_display = ['user', 'display_friends']
    search_fields = ['user']    
    readonly_fields = ['user']

    def display_friends(self, obj):
            """
            Método personalizado para mostrar los amigos en el admin
            """
            return ", ".join([friend.username for friend in obj.friends.all()])
    display_friends.short_description = 'Friends'
    
    class Meta:
        model = FriendList
class FriendRequestAdmin(admin. ModelAdmin):
    list_filter = ['sender','receiver']
    list_display= ['sender','receiver']

    search_fields = ['sender__username', 'sender__email', 'receiver__username', 'receiver__email' ]

    class Meta:
        model = FriendRequest

admin. site.register (FriendRequest, FriendRequestAdmin)
admin.site.register(FriendList, FriendListAdmin)
