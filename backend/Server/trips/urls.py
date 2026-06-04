from django.urls import path
from .views import (TripListCreateAPIView,TripDetailAPIView,TripCancelAPIView)

urlpatterns = [
    path("trips/", TripListCreateAPIView.as_view(), name="trip-list-create"),
    path("trips/<int:pk>/", TripDetailAPIView.as_view(), name="trip-detail"),

   
    path("trips/<int:pk>/cancel/", TripCancelAPIView.as_view(), name="trip-cancel"),
]