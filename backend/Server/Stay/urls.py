from django.urls import path
from .views import StayListAPIView

urlpatterns = [
    
    path('', StayListAPIView.as_view(), name='stay-list'),
]