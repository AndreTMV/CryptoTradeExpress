from rest_framework import serializers
from .models import Video, Section, Eliminated_Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        # fields = ('id', 'title', 'description', 'done')
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        # fields = ('id', 'title', 'description', 'done')
        fields = '__all__'

class Eliminated_VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eliminated_Video
        # fields = ('id', 'title', 'description', 'done')
        fields = '__all__'