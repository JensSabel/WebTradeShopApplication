from rest_framework import serializers
from .models import Item

# To convert model instances to JSON for the frontend to handle
class ItemSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(default=serializers.CurrentUserDefault(), read_only=True)
    class Meta:
        model = Item
        fields = ('id','title', 'description','price','date_added','available','owner') #owner renamed to User

