import random

from django.conf import settings
from django.core.mail import send_mail
from django.core.cache import cache

from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import (MultiPartParser,FormParser,JSONParser)
from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    VerifyOTPSerializer,
    ResendOTPSerializer
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            if User.objects.filter(email=email).exists():
                return Response({"error":"Email already exists"}, status=400)

            otp = str(random.randint(100000,999999))

            temp_user_data = {
                "full_name":serializer.validated_data['full_name'],
                "email":email,
                "phone":serializer.validated_data['phone'],
                "password":serializer.validated_data['password'],
                "otp":otp
            }

            cache.set(email, temp_user_data, timeout=300)

            send_mail(
                subject='OTP Verification',
                message=f'Your OTP is {otp}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({
                "message": "OTP Sent Successfully",
                "email": email
            })

        print(serializer.errors)
        return Response(serializer.errors, status=400)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            temp_user = cache.get(email)

            if not temp_user:
                return Response({"error": "OTP Expired"}, status=400)

            if temp_user['otp'] != otp:
                return Response({"error": "Invalid OTP"}, status=400)

            user = User.objects.create(
                full_name=temp_user['full_name'],
                email=temp_user['email'],
                phone=temp_user['phone'],
                is_verified=True
            )

            user.set_password(temp_user['password'])
            user.save()
            cache.delete(email)

            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Account Created Successfully",
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    
                    "is_admin": user.is_superuser 
                }
            })

            response.set_cookie("access_token", str(refresh.access_token), httponly=True, samesite='Lax')
            response.set_cookie("refresh_token", str(refresh), httponly=True, samesite='Lax')

            return response

        return Response({"error": "Invalid OTP request"}, status=400)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            temp_user = cache.get(email)

            if not temp_user:
                return Response({"error": "Session Expired"}, status=400)

            otp = str(random.randint(100000, 999999))
            temp_user['otp'] = otp
            cache.set(email, temp_user, timeout=300)

            send_mail(
                subject='Resend OTP',
                message=f'Your New OTP is {otp}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({"message": "New OTP Sent Successfully"})

        return Response({"error": "Invalid request"}, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Login Successful",
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                   
                    "is_admin": user.is_superuser 
                }
            })

            response.set_cookie("access_token", str(refresh.access_token), httponly=True, samesite='Lax')
            response.set_cookie("refresh_token", str(refresh), httponly=True, samesite='Lax')

            return response

        return Response({"error": "Wrong email or password"}, status=400)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')

        if not token:
            return Response({"error": "Token missing"}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                "531839352181-2bh6hediu8ssbddu9f92ocr3ob1pqbbq.apps.googleusercontent.com"
            )

            email = idinfo.get('email')
            name = idinfo.get('name', '')

            if not email:
                return Response({"error": "Google account has no email"}, status=400)

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": name,
                    "is_verified": True
                }
            )

            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Google Login Successful",
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                   
                    "is_admin": user.is_superuser 
                }
            })

            response.set_cookie("access_token", str(refresh.access_token), httponly=True, samesite='Lax')
            response.set_cookie("refresh_token", str(refresh), httponly=True, samesite='Lax')

            return response

        except ValueError:
            return Response({"error": "Invalid Google Token"}, status=400)
        except Exception:
            return Response({"error": "Google authentication failed"}, status=400)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        otp = str(random.randint(100000, 999999))
        cache.set(f"reset_{email}", otp, timeout=300)

        send_mail(
            subject="Reset Password OTP",
            message=f"Your OTP is {otp}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent to email"})


class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        cached_otp = cache.get(f"reset_{email}")

        if not cached_otp:
            return Response({"error": "OTP expired"}, status=400)

        if cached_otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        return Response({"message": "OTP verified"})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        user.set_password(new_password)
        user.save()
        cache.delete(f"reset_{email}")

        return Response({"message": "Password reset successful"})


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"message": "Logged out successfully"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
    

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser,FormParser,JSONParser)

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
    
        data['is_admin'] = request.user.is_superuser
        return Response(data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            data = serializer.data
           
            data['is_admin'] = user.is_superuser
            return Response(data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)