from django.urls import path
from .views import EventSearchAPIView

urlpatterns = [
    
    path('events/', EventSearchAPIView.as_view(), name='event-search'),
]