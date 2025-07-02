# simulator/serializers.py

from rest_framework import serializers
from .models import Simulacion, Transaccion, PrecioBitcoin, Tweet

class SimulacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Simulacion
        fields = '__all__'

class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaccion
        fields = '__all__'

class PrecioBitcoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecioBitcoin
        fields = '__all__'

class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = '__all__'
