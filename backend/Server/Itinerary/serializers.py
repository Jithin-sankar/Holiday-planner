from rest_framework import serializers

from .models import Itinerary


class ItinerarySerializer(serializers.ModelSerializer):

    class Meta:

        model = Itinerary

        fields = [
            'id',
            'trip',
            'day_plan',
            'destination_image',
            'ai_model',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'created_at',
            'updated_at'
        ]