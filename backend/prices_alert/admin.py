from django.contrib import admin
from .models import PriceAlertSpecs

# Register your models here.
class PriceAlertAdmin(admin.ModelAdmin):
    list_display = ('user','min_price', 'max_price', 'min_date', 'max_date', 'is_active', 'cripto')

admin.site.register(PriceAlertSpecs, PriceAlertAdmin)