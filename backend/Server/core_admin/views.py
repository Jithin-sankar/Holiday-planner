from django.db.models import Sum
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework import status

from trips.models import Trip 

User = get_user_model()

class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

class AdminPlatformStatsView(APIView):
    permission_classes = [IsSuperUser] 

    def get(self, request):
        
        all_users = User.objects.filter(is_superuser=False).order_by('-date_joined')
        total_users = all_users.count()
        
        
        total_trips = Trip.objects.count() 
        total_platform_value = Trip.objects.aggregate(total=Sum('budget'))['total'] or 0

        all_trips = Trip.objects.all().order_by('-created_at')
        recent_trips_data = []
        for trip in all_trips:
            recent_trips_data.append({
                "id": trip.id,
                "user": trip.user.email if trip.user else "Unknown",
                "destination": trip.destination,
                "budget": trip.budget,
                "status": trip.status,
                
                "start_date": str(trip.start_date) if getattr(trip, 'start_date', None) else None,
                "end_date": str(trip.end_date) if getattr(trip, 'end_date', None) else None
            })

        user_list = []
        for u in all_users:
            user_list.append({
                "id": u.id,
                "full_name": getattr(u, 'full_name', '') or "Unknown User",
                "email": u.email,
                "phone": getattr(u, 'phone', 'N/A'),
                "is_active": u.is_active 
            })

        return Response({
            "total_users": total_users,
            "total_trips": total_trips,
            "total_platform_value": total_platform_value,
            "recent_activity": recent_trips_data,
            "user_list": user_list 
        })

class ToggleUserBlockView(APIView):
    permission_classes = [IsSuperUser]
    
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, is_superuser=False)
            user.is_active = not user.is_active
            user.save()
            return Response({"message": "User status updated", "is_active": user.is_active})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
class DeleteUserView(APIView):
    permission_classes = [IsSuperUser]
    
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, is_superuser=False)
            user.delete()
            return Response({"message": "User permanently deleted"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteTripView(APIView):
    permission_classes = [IsSuperUser]
    
    def delete(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
            trip_budget = trip.budget 
            trip.delete()
            return Response({"message": "Trip deleted permanently", "deducted_budget": trip_budget}, status=status.HTTP_200_OK)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)