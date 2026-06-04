from django.db import models
from trips.models import Trip
# Create your models here.
class Event(models.Model):

    trip = models.ForeignKey(Trip,on_delete=models.CASCADE,related_name='events')

    title = models.CharField(max_length=255)

    date = models.DateField()

    location = models.CharField(max_length=255)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )