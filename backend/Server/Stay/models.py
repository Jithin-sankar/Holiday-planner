from django.db import models

# Create your models here.
from django.db import models

class Stay(models.Model):
    STAY_TYPES = [
        ('hotel', 'Luxury Hotel'),
        ('camp', 'Night Camp'),
    ]
    
    name = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)  # Matches trip.destination (e.g., "Dubai", "Goa")
    price = models.CharField(max_length=50)        # e.g., "₹18,500"
    rating = models.FloatField(default=4.5)
    stay_type = models.CharField(max_length=10, choices=STAY_TYPES, default='hotel')
    image = models.URLField(max_length=500)
    
    def __str__(self):
        return f"{self.name} ({self.destination})"