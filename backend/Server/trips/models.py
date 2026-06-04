from django.db import models

from accounts.models import User


class Trip(models.Model):

    STATUS_CHOICES = (

        ('planned', 'Planned'),

        ('ongoing', 'Ongoing'),

        ('completed', 'Completed'),

        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(

        User,

        on_delete=models.CASCADE,

        related_name='trips'
    )

    destination = models.CharField(
        max_length=255
    )

    start_date = models.DateField()

    end_date = models.DateField()

    travelers = models.PositiveIntegerField()

    budget = models.DecimalField(

        max_digits=10,

        decimal_places=2
    )

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default='planned'
    )

    image = models.URLField(
        max_length=1000,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.destination