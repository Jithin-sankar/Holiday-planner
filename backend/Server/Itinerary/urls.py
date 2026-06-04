from django.urls import path

from .views import GenerateItineraryAPIView,ItineraryPreviewAPIView


urlpatterns = [

    path('generate/<int:trip_id>/',GenerateItineraryAPIView.as_view()),
    path("preview/", ItineraryPreviewAPIView.as_view()),
]