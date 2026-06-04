from django.db import models

# Create your models here.
from django.db import models

from accounts.models import User



class HolidayPlan(models.Model):

    HOLIDAY_TYPES = (

        ('beach', 'Beach'),

        ('adventure', 'Adventure'),

        ('family', 'Family'),

        ('honeymoon', 'Honeymoon'),

        ('luxury', 'Luxury'),

        ('festival', 'Festival'),

        ('roadtrip', 'Road Trip'),
    )


    STATUS_CHOICES = (

        ('planned', 'Planned'),

        ('ongoing', 'Ongoing'),

        ('completed', 'Completed'),
    )


    user = models.ForeignKey(

        User,

        on_delete=models.CASCADE,

        related_name='holidays'
    )


    title = models.CharField(
        max_length=255
    )


    destination = models.CharField(
        max_length=255
    )


    start_date = models.DateField()


    end_date = models.DateField()


    budget = models.DecimalField(

        max_digits=10,

        decimal_places=2
    )


    travelers = models.PositiveIntegerField(
        default=1
    )


    holiday_type = models.CharField(

        max_length=20,

        choices=HOLIDAY_TYPES
    )


    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default='planned'
    )


    description = models.TextField(

        blank=True,

        null=True
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):

        return self.title