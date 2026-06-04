from django.db import models

from trips.models import Trip


class Itinerary(models.Model):

    trip = models.OneToOneField(
        Trip,
        on_delete=models.CASCADE,
        related_name='itinerary'
    )

  
    day_plan = models.TextField()

   
    destination_image = models.URLField(
        blank=True,
        null=True
    )

  
    ai_model = models.CharField(
        max_length=100,
        default='gemini-2.5-flash'
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return f"Itinerary for {self.trip.destination}"