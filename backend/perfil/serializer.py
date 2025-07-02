from rest_framework import serializers
from .models import Perfil, ExcludedRecomendations
from amigos.serializer import FriendListSerializer



class PerfilSerializer(serializers.ModelSerializer):
    friend_list_count = serializers.SerializerMethodField()

    class Meta:
        model = Perfil
        fields = ['id', 'name', 'interested_cryptos', 'description', 'date_joined', 'birth_day', 'videos_calification', 'username', 'friend_list_count', 'hide_information']

    def get_friend_list_count(self, obj):
        """
        Returns the count of friends for the profile
        """
        if obj.friend_list:
            return obj.friend_list.friends.count()
        else:
            return 0

class ExcludedRecomendationsSerializer(serializers.ModelSerializer): 
    class Meta:
        model = ExcludedRecomendations
        fields = '__all__'

# class PerfilSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Perfil
#         # fields = ('id', 'title', 'description', 'done')
#         fields = '__all__'