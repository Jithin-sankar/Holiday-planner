from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from trips.models import Trip
from .models import Itinerary
from .serializers import ItinerarySerializer
from .ai import generate_ai_itinerary
from .ai import generate_preview_itinerary

class GenerateItineraryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):

        try:
            trip = Trip.objects.get(
                id=trip_id,
                user=request.user
            )

        except Trip.DoesNotExist:
            return Response(
                {"error": "Trip not found"},
                status=404
            )

        
        ai_response = generate_ai_itinerary(trip)

        
        itinerary, created = Itinerary.objects.update_or_create(

            trip=trip,

            defaults={
                "day_plan": ai_response,
                "destination_image": trip.image,
                "ai_model": "gemini-2.5-flash"
            }
        )

        serializer = ItinerarySerializer(itinerary)

        return Response(serializer.data, status=200)

class ItineraryPreviewAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data

        result = generate_preview_itinerary(data)

        return Response({
            "day_plan": result
        })