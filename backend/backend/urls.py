"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

from rest_framework import routers
from webshop import views

from accounts.urls import accounts_urlpatterns

router = routers.DefaultRouter()
router.register(r'items',views.ItemView,'item')

REACTPATH = 'index.html'
# TO NOTE! Here I've tried different approaches to URLS, not good for consistency but interesting to try :)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)), # API calls done via this URL
    path('populate_database/', views.populate_database, name='populate_database'),
    path('update-basket/', views.UpdateBasketView.as_view(), name='update_basket'),
    path('update-availability/', views.UpdateAvailability.as_view(), name='update_availability'),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('login/', TemplateView.as_view(template_name=REACTPATH), name='login_name'),
    path('register/', TemplateView.as_view(template_name=REACTPATH)),
    path('account/', login_required(TemplateView.as_view(template_name=REACTPATH))),
    path('myitems/', login_required(TemplateView.as_view(template_name=REACTPATH))),
    path('additem/', login_required(TemplateView.as_view(template_name=REACTPATH))),
    path('', TemplateView.as_view(template_name=REACTPATH)),
    #re_path(r'^.*$', TemplateView.as_view(template_name="index.html")) <- Accepts all, create 404 with this
]

urlpatterns += accounts_urlpatterns # Adds URLs for authentication