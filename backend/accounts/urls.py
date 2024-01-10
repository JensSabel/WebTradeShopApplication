from django.urls import include, path, re_path
from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

accounts_urlpatterns = [
    path("api/register/", views.RegisterUser.as_view()),
    path("api/login", views.LoginView.as_view()),
    path("api/check-login/", views.CheckLogin.as_view()),
    path("api/logout", views.LogoutView.as_view()),
    path("api/getuserinfo/", views.GetUser.as_view()),
    path("api/reset_password/", views.ChangePassword.as_view()),
]