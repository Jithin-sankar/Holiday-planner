from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True
    )
    confirm_password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            'full_name',
            'email',
            'phone',
            'password',
            'confirm_password',
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                "Passwords do not match"
            )
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(
            username=data['email'], 
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid Credentials"
            )

        if not user.is_verified and not user.is_superuser:
            raise serializers.ValidationError(
                "Please Verify OTP First"
            )

        data['user'] = user
        return data


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(
        required=False
    )

    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'location',
            'profile_image'
        ]