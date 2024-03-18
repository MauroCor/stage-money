from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class FixedCost(models.Model):
    month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    name = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=1000000, decimal_places=0)


class Ingreso(models.Model):
    fecha = models.DateField()
    concepto = models.CharField(max_length=100)
    monto = models.DecimalField(max_digits=10, decimal_places=2)