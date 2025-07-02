from django.db import models
from login.models import User

# Create your models here.
class PriceAlertSpecs(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    min_price = models.FloatField()
    max_price = models.FloatField()
    min_date = models.DateField()
    max_date = models.DateField()
    is_active = models.BooleanField(default=True)
    cripto = models.CharField(max_length=200, null=True)

    class Meta:
        verbose_name_plural = "Price Alert Specs"

    def __str__(self) -> str:
        return f"{self.max_price} - {self.max_date}"