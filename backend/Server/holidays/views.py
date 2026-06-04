from django.db.models import Sum
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework import status

from .models import HolidayPlan
from .serializers import HolidayPlanSerializer


User = get_user_model()


class HolidayListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        holidays = HolidayPlan.objects.filter(
            user=request.user
        ).order_by('-created_at')

        serializer = HolidayPlanSerializer(
            holidays,
            many=True
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = HolidayPlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class HolidayDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return HolidayPlan.objects.get(pk=pk, user=user)
        except HolidayPlan.DoesNotExist:
            return None

    def get(self, request, pk):
        holiday = self.get_object(pk, request.user)
        if not holiday:
            return Response(
                {"error": "Holiday not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = HolidayPlanSerializer(holiday)
        return Response(serializer.data)

    def put(self, request, pk):
        holiday = self.get_object(pk, request.user)
        if not holiday:
            return Response(
                {"error": "Holiday not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = HolidayPlanSerializer(holiday, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        holiday = self.get_object(pk, request.user)
        if not holiday:
            return Response(
                {"error": "Holiday not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        holiday.delete()
        return Response(
            {"message": "Holiday deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        holidays = HolidayPlan.objects.filter(user=request.user)
        total_holidays = holidays.count()
        planned_holidays = holidays.filter(status='planned').count()
        ongoing_holidays = holidays.filter(status='ongoing').count()
        completed_holidays = holidays.filter(status='completed').count()

        total_budget = holidays.aggregate(
            total=Sum('budget')
        )['total'] or 0

        recent_holidays = HolidayPlan.objects.filter(
            user=request.user
        ).order_by('-created_at')[:5]
        
        recent_serializer = HolidayPlanSerializer(recent_holidays, many=True)

        return Response({
            'total_holidays': total_holidays,
            'planned_holidays': planned_holidays,
            'ongoing_holidays': ongoing_holidays,
            'completed_holidays': completed_holidays,
            'total_budget': total_budget,
            'recent_holidays': recent_serializer.data
        })


