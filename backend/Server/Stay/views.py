from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Stay
from .serializers import StaySerializer
from .services import fetch_hotels


class StayListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        destination_param = request.query_params.get(
            'destination',
            ''
        ).strip()

        if not destination_param or len(destination_param) < 3:

            return Response(
                [],
                status=status.HTTP_200_OK
            )

        queryset = Stay.objects.filter(
            destination__icontains=destination_param
        )

        if not queryset.exists():

            print(
                f"Database empty for '{destination_param}'. "
                f"Fetching live hotel data..."
            )

            live_hotels = fetch_hotels(destination_param)

            for hotel in live_hotels[:5]:

                try:

                    image_url = (
                        hotel.get("images", [{}])[0]
                        .get(
                            "thumbnail",
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                        )
                    )

                    price = (
                        hotel.get("rate_per_night", {})
                        .get("lowest", "Price on Request")
                    )

                    Stay.objects.create(

                        name=hotel.get(
                            "name",
                            "Premium Stay"
                        ),

                        destination=destination_param.title(),

                        price=str(price),

                        rating=hotel.get(
                            "overall_rating",
                            4.0
                        ),

                        stay_type="hotel",

                        image=image_url
                    )

                except Exception as e:

                    print("Error saving hotel:", e)

            queryset = Stay.objects.filter(
                destination__icontains=destination_param
            )

        serializer = StaySerializer(
            queryset,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )