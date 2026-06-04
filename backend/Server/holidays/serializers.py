from rest_framework import serializers

from .models import HolidayPlan



class HolidayPlanSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = HolidayPlan

        fields = '__all__'

        read_only_fields = [

            'id',

            'user',

            'created_at',

            'updated_at'
        ]