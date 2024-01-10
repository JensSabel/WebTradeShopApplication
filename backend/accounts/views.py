from django.shortcuts import render
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import HttpResponseBadRequest

from .serializers import LoginSerializer, UserSerializer, RegisterSerializer
# Create your views here.
class LoginView(APIView):
    """
    Login user
    """

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response("not valid", status=400)
        user = authenticate(
            username=serializer.data["username"], password=serializer.data["password"]
        )
        if user is not None:
            login(request, user)
            return Response(f"is logged in: {user.get_username()}")
        return HttpResponseBadRequest("This user does not exist, please enter correct username/password", status=404)

class RegisterUser(APIView):
    """
    Register User
    """
    serializer_class = RegisterSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response("Credentials entered were not valid", status=400)
        try:
            user = User.objects.create_user(
                username=serializer.data["username"],
                email=serializer.data["email"],
                password=serializer.data["password"],
            )
        except IntegrityError:
            return Response(f"same user name already exists in database", status=400)
        if user is not None:
            return Response(f"new user is: {user.get_username()}")
        return Response("no new user added :(")

class CheckLogin(APIView):
    """
    Checks if the user is logged in
    """
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        return Response(f"{request.user.get_username()}")
    

class GetUser(APIView):
    """
    Gets information about a user
    """
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = self.request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    """
    Logout function
    """
    def post(self, request):
        logout(request)
        return Response({'message': "Logout successful"})

class ChangePassword(APIView):
    """
    Change Password functionality
    """
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        user = self.request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password1')

        auth_user = authenticate(username=user.username, password=old_password)

        if auth_user is not None:
            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)
            success = f'Password Change was successful for user: {user.username}'
            return Response({'message': success})
        else:
            return Response({'error':'Invalid old password'},status=400)