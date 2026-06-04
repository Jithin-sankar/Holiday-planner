from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from trips.models import Trip
from trips.serializers import TripSerializer
from trips.utils import get_destination_image



class TripListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        trips = Trip.objects.filter(
            user=request.user
        ).exclude(
            status='cancelled'
        ).order_by('-created_at')

        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)


    def post(self, request):

        data = request.data.copy()

        destination = data.get('destination')
        data['image'] = get_destination_image(destination)

        serializer = TripSerializer(data=data)

        if serializer.is_valid():

            trip = serializer.save(
                user=request.user,
                status='planned'   # IMPORTANT FIX
            )

            return Response(
                TripSerializer(trip).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TripDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Trip.objects.get(pk=pk, user=user)
        except Trip.DoesNotExist:
            return None


    def get(self, request, pk):

        trip = self.get_object(pk, request.user)

        if not trip or trip.status == "cancelled":
            return Response({"error": "Trip not found"}, status=404)

        serializer = TripSerializer(trip)
        return Response(serializer.data)


    def put(self, request, pk):

        trip = self.get_object(pk, request.user)

        if not trip or trip.status == "cancelled":
            return Response({"error": "Cannot update this trip"}, status=400)

        serializer = TripSerializer(trip, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


    def patch(self, request, pk):

        trip = self.get_object(pk, request.user)

        if not trip or trip.status == "cancelled":
            return Response({"error": "Cannot update this trip"}, status=400)

        serializer = TripSerializer(
            trip,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


    def delete(self, request, pk):

        trip = self.get_object(pk, request.user)

        if not trip:
            return Response({"error": "Trip not found"}, status=404)

        trip.delete()
        return Response(status=204)


class TripCancelAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            trip = Trip.objects.get(pk=pk, user=request.user)

            if trip.status == "cancelled":
                return Response({"message": "Already cancelled"})

            trip.status = "cancelled"
            trip.save()

            return Response({"message": "Trip cancelled successfully"})

        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=404)