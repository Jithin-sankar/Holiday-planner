from django.db import models

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    username = None

    full_name = models.CharField(
        max_length=150
    )

    email = models.EmailField(
        unique=True
    )

    phone = models.CharField(
        max_length=15
    )
    location = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    is_verified = models.BooleanField(
        default=False
    )

    otp = models.CharField(
        max_length=6,
        null=True,
        blank=True
    )

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = []

    profile_image = models.ImageField(

    upload_to='profiles/',

    null=True,

    blank=True
)

    def __str__(self):

        return self.email
    
