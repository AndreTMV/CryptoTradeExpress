from rest_framework import serializers
from .models import Noticia, CryptosTrending

class NoticiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Noticia
        fields = '__all__'

class CryptosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CryptosTrending
        fields = '__all__'

