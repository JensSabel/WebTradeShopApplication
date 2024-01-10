from django.shortcuts import render, redirect
from rest_framework import viewsets, authentication, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ItemSerializer
from .models import Item
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication
from django.core.management import call_command
from django.http import JsonResponse
from django_filters import rest_framework as filters

# Create your views here.

class ItemFilter(filters.FilterSet):
    owner = filters.CharFilter(field_name="owner__username", lookup_expr="exact")
    title = filters.CharFilter(field_name="title", lookup_expr="contains")
    available = filters.BooleanFilter(field_name="available")
    id = filters.NumberFilter(field_name="id",lookup_expr="exact")
    class Meta:
        model = Item
        fields = ["id","title","owner","available"]

class ItemView(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ItemFilter

    def perform_create(self, serializer):
       serializer.save(owner=self.request.user)

class UpdateBasketView(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        new_basket = request.data.get('basket',[])

        try:
            for item_data in new_basket:
                item_id = item_data.get('id')
                item = Item.objects.get(id=item_id)

                # Checks if the item is still available
                if (item.available == False):
                    return Response({'message':f'{item.title} is no longer available for sale, please remove it from your cart!'}
                                    , status=status.HTTP_410_GONE)
                # Checks if the price of the item is still the same as when user entered it to basket
                #TODO - Fix the update of users basket in frontend
                price = item_data.get('price')
                if (item.price != price):
                    return Response({'message':f'The price of: {item.title}, has changed price! Remove the item and reload the page!',
                                     'realPrice': item.price}, 
                                     status=status.HTTP_409_CONFLICT)
                # If all checks out the user gets set as owner of the item!
                item.owner = user
                item.available = False
                item.save()
            return Response({'message':'Items bought successfully!'}, status=status.HTTP_200_OK)
        except Item.DoesNotExist:
            return Response({'message':'One or more items not found!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message':f'Error: {str(e)}'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
class UpdateAvailability(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        item_id = request.data.get('id')
        option = request.data.get('available')

        try:
            item = Item.objects.get(id=item_id)
            item.available = option
            item.save()
            return Response({'message':'Availability was successfully updated'}, status=status.HTTP_200_OK)
        except Item.DoesNotExist:
            return Response({'message':'Item was not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message':f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Automatic database repopulate call command:

def populate_database(request):
    call_command('populatedb')
    return JsonResponse({'message':'Database populated successfully'})