from django.contrib import admin

# Register your models here.
from .models import Video, Section, Eliminated_Video 

# Register your models here.
class SectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

class VideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'url', 'views','date_uploaded', 'stars', 'title', 'section','accepted')

class Eliminated_VideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'video_id', 'title', 'url')

admin.site.register(Section, SectionAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(Eliminated_Video, Eliminated_VideoAdmin)