from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

# Create your models here.
class Compra(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    criptomoneda_bought = models.CharField(max_length=200)
    criptomoneda_sold = models.CharField(max_length=201)
    date = models.DateTimeField(auto_now_add=True)
    buying_price = models.DecimalField(max_digits=100, decimal_places=10)
    max_percentage_lost = models.DecimalField(max_digits=5, decimal_places=2,validators=[MinValueValidator(0.01), MaxValueValidator(500)])
    min_percentage_gain = models.DecimalField(max_digits=5, decimal_places=2,validators=[MinValueValidator(0.01), MaxValueValidator(500)])
    cuantity_bought = models.FloatField(null=True)


    def __str__(self) -> str:
        return f'{self.user.username}: {self.criptomoneda_bought}' 

class Venta(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, null=True)
    criptomoneda_sold = models.CharField(max_length=201)
    criptomoneda_bought = models.CharField(max_length=201, null=True)
    date = models.DateTimeField(auto_now_add=True)
    selling_price = models.DecimalField(max_digits=100, decimal_places=10)
    cuantity_sold = models.FloatField(null=True)
    max_percentage_lost = models.DecimalField(max_digits=5, decimal_places=2,validators=[MinValueValidator(0.01), MaxValueValidator(500)], null=True)
    min_percentage_gain = models.DecimalField(max_digits=5, decimal_places=2,validators=[MinValueValidator(0.01), MaxValueValidator(500)], null=True)

    def clean(self):
        if self.compra.user != self.user:
            raise ValidationError("La compra asociada no pertenece al mismo usuario que la venta.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.user.username}: cripto:{self.criptomoneda_sold}, price:{self.selling_price}' 

