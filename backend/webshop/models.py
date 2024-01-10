from django.db import models
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth. models import User

# Create your models here.
"""
    The model consists of:
    - Title = Name of a item
    - Description = Description of a item
    - Price = Pirce of an item
    - Date_added = The date the item was added to the store.
    - Available = If the item is available to be sold
    - Owner = The current owner of an item (username from account)
"""

# Defining item model
class Item(models.Model):
    title = models.CharField(null=False, max_length=120)
    description = models.TextField(max_length=300)
    price = models.FloatField(null=False)
    date_added = models.DateField(auto_now_add=True)
    available = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner', blank=True,null=True)

    def __str__(self):
        return self.title
    