from typing import Any
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from webshop.models import Item
from django.core.management import call_command
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populate the database with simple data'

    def handle(self, *args, **options): 
        
        #Clear Existing Data
        User.objects.all().delete()
        Item.objects.all().delete()

        item_list = [ #Thx ChatGPT for rendering random items
        {'title': 'Laptop', 'description': 'Powerful laptop for work and gaming', 'price':Decimal('1200.00'), 'available': True},
        {'title': 'Smartphone', 'description': 'Latest model with high-end features', 'price': Decimal('800.00'), 'available': True},
        {'title': 'Headphones', 'description': 'Noise-canceling headphones for immersive audio', 'price': Decimal('150.00'), 'available': True},
        {'title': 'Desk Chair', 'description': 'Ergonomic chair for comfortable work', 'price': Decimal('200.00'), 'available': True},
        {'title': 'Camera', 'description': 'Professional DSLR camera for photography enthusiasts', 'price': Decimal('1000.00'), 'available': True},
        {'title': 'Tablet', 'description': 'Lightweight tablet for on-the-go use', 'price': Decimal('400.00'), 'available': True},
        {'title': 'Gaming Console', 'description': 'Next-gen gaming console for gaming enthusiasts', 'price': Decimal('500.00'), 'available': True},
        {'title': 'Fitness Tracker', 'description': 'Track your fitness goals with this advanced tracker', 'price': Decimal('100.00'), 'available': True},
        {'title': 'Home Theater System', 'description': 'Immerse yourself in high-quality audio with this home theater system', 'price': Decimal('800.00'), 'available': True},
        {'title': 'Wireless Earbuds', 'description': 'Enjoy wireless freedom with these stylish earbuds', 'price': Decimal('120.00'), 'available': True},
        {'title': 'Coffee Maker', 'description': 'Brew your favorite coffee with this state-of-the-art coffee maker', 'price': Decimal('50.00'), 'available': True},
        {'title': 'Robot Vacuum Cleaner', 'description': 'Effortlessly keep your home clean with this smart vacuum cleaner', 'price': Decimal('300.00'), 'available': True},
        {'title': 'Smart Watch', 'description': 'Stay connected and track your activities with this stylish smartwatch', 'price': Decimal('180.00'), 'available': True},
        {'title': 'Bluetooth Speaker', 'description': 'Portable speaker for music on the go', 'price': Decimal('70.00'), 'available': True},
        {'title': 'Drones', 'description': 'Capture breathtaking aerial views with this high-quality drone', 'price': Decimal('700.00'), 'available': True},
        {'title': 'External Hard Drive', 'description': 'Expand your storage with this reliable external hard drive', 'price': Decimal('90.00'), 'available': True},
        {'title': 'LED Desk Lamp', 'description': 'Illuminate your workspace with this adjustable LED desk lamp', 'price': Decimal('25.00'), 'available': True},
        {'title': 'Smart Thermostat', 'description': 'Control your home temperature with this smart thermostat', 'price': Decimal('120.00'), 'available': True},
        {'title': 'Travel Backpack', 'description': 'Durable backpack for your travel adventures', 'price': Decimal('60.00'), 'available': True},
        {'title': 'Electric Toothbrush', 'description': 'Keep your teeth clean with this advanced electric toothbrush', 'price': Decimal('40.00'), 'available': True},
        {'title': 'Air Purifier', 'description': 'Improve air quality with this efficient air purifier', 'price': Decimal('150.00'), 'available': True},
        {'title': 'Bluetooth Earphones', 'description': 'Wireless earphones for an immersive audio experience', 'price': Decimal('80.00'), 'available': True},
        {'title': 'Solar Power Bank', 'description': 'Charge your devices on the go with this solar-powered power bank', 'price': Decimal('10.00'), 'available': True},
        {'title': 'Portable Projector', 'description': 'Enjoy movies and presentations anywhere with this portable projector', 'price': Decimal('200.00'), 'available': True},
        {'title': 'Smart Doorbell', 'description': 'Enhance your home security with this smart doorbell', 'price': Decimal('120.00'), 'available': True},
        {'title': 'Hiking Boots', 'description': 'Comfortable and durable boots for your outdoor adventures', 'price': Decimal('90.00'), 'available': True},
        {'title': 'Digital Drawing Tablet', 'description': 'Unleash your creativity with this digital drawing tablet', 'price': Decimal('150.00'), 'available': True},
        {'title': 'Foldable Bluetooth Keyboard', 'description': 'Compact keyboard for on-the-go productivity', 'price': Decimal('30.00'), 'available': True},
        {'title': 'Wireless Charging Pad', 'description': 'Conveniently charge your devices wirelessly with this charging pad', 'price': Decimal('25.00'), 'available': True},
        {'title': 'Yoga Mat', 'description': 'Premium yoga mat for your fitness routine', 'price': Decimal('20.00'), 'available': True},
        {'title': 'Rainbow LED Strip Lights', 'description': 'Add vibrant lighting to your space with these colorful LED strip lights', 'price': Decimal('35.00'), 'available': True},
        ]
        
        superuser = User.objects.create_superuser('jens','jens.sabel@abo.fi','jens')

        for i in range(1,7):
            username = f'testuser{i}'
            email = f'testuser{i}@shop.aa'
            password = f'pass{i}'
            user = User.objects.create_user(username=username,email=email, password=password)
            
            start_index = (i - 1) * 10
            end_index = i * 10

            #Create 10 items for 3 users
            if i<=3 or i==4:
                for item_data in item_list[start_index:end_index]:
                    Item.objects.create(owner=user, **item_data)
            
        self.stdout.write(self.style.SUCCESS('Database populated successfully'))