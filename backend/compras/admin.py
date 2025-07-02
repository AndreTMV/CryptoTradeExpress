from django.contrib import admin
from .models import Compra, Venta

# Register your models here.

class CompraAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'criptomoneda_bought', 'criptomoneda_sold', 'date', 'buying_price', 'max_percentage_lost', 'min_percentage_gain', 'cuantity_bought')

class VentaAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'compra','criptomoneda_sold', 'criptomoneda_bought', 'date', 'selling_price', 'cuantity_sold', 'max_percentage_lost', 'min_percentage_gain',)

admin.site.register(Compra, CompraAdmin)
admin.site.register(Venta, VentaAdmin)