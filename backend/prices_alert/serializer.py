from rest_framework import serializers
from .models import PriceAlertSpecs

class PriceAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceAlertSpecs
        fields = '__all__'
