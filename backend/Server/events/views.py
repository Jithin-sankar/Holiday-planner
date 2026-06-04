from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import fetch_live_events 

class EventSearchAPIView(APIView):
    def get(self, request, *args, **kwargs):
       
        destination = request.query_params.get('destination', '')
        
        if not destination:
            return Response([])
            
   
        clean_city = destination.split(',')[0].strip()
        
        
        events = fetch_live_events(clean_city)
        
        return Response(events)