from django.urls import path
from .views import (
    AdminPlatformStatsView, 
    ToggleUserBlockView, 
    DeleteUserView
)

urlpatterns = [
    path('stats/', AdminPlatformStatsView.as_view(), name='admin-stats'),
    path('toggle-block/<int:user_id>/', ToggleUserBlockView.as_view(), name='toggle-block'),
    path('delete-user/<int:user_id>/', DeleteUserView.as_view(), name='delete-user'),
]