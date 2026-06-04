from django.urls import path

from .views import (HolidayListCreateView,HolidayDetailView,DashboardStatsView)

urlpatterns = [

    path('list/',HolidayListCreateView.as_view()),

    path('<int:pk>/',HolidayDetailView.as_view()),

    path('dashboard-stats/',DashboardStatsView.as_view()),
]