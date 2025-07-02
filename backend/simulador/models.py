from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Simulacion(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=3000.00)
    bitcoins = models.DecimalField(max_digits=10, decimal_places=8, default=0.0)
    fecha = models.DateField(auto_now_add=True)

class Transaccion(models.Model):
    simulacion = models.ForeignKey(Simulacion, on_delete=models.CASCADE,null=True)
    tipo = models.CharField(max_length=10, choices=[('compra', 'Compra'), ('venta', 'Venta')])
    cantidad = models.DecimalField(max_digits=10, decimal_places=8)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)

class PrecioBitcoin(models.Model):
    simulacion = models.ForeignKey(Simulacion, on_delete=models.CASCADE, null=True)
    fecha = models.DateField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)

class Tweet(models.Model):
    simulacion = models.ForeignKey(Simulacion, on_delete=models.CASCADE, null=True)
    fecha = models.DateTimeField()
    contenido = models.TextField()