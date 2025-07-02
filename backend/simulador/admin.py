# Register your models here.
from django.contrib import admin
from .models import Simulacion, Transaccion, PrecioBitcoin

class SimulacionAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'bitcoins', 'fecha')
    search_fields = ('user__username', 'balance', 'bitcoins', 'fecha')
    list_filter = ('fecha',)

class TransaccionAdmin(admin.ModelAdmin):
    list_display = ('simulacion', 'tipo', 'cantidad', 'precio', 'fecha')
    search_fields = ('simulacion__user__username', 'tipo', 'cantidad', 'precio', 'fecha')
    list_filter = ('tipo', 'fecha')

class PrecioBitcoinAdmin(admin.ModelAdmin):
    list_display = ('simulacion', 'fecha', 'precio')
    search_fields = ('simulacion__user__username', 'fecha', 'precio')
    list_filter = ('fecha',)

admin.site.register(Simulacion, SimulacionAdmin)
admin.site.register(Transaccion, TransaccionAdmin)
admin.site.register(PrecioBitcoin, PrecioBitcoinAdmin)
