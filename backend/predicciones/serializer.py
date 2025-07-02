from rest_framework import serializers

class CryptoSerializer(serializers.Serializer):
    cryptos = serializers.ListField(child=serializers.CharField())