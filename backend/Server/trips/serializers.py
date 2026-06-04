from rest_framework import serializers

from .models import Trip

from Itinerary.serializers import ItinerarySerializer

class TripSerializer(serializers.ModelSerializer):

     itinerary = ItinerarySerializer(
        read_only=True
    )


     class Meta:

        model = Trip

        fields = '__all__'

        read_only_fields = ['user','created_at','status']