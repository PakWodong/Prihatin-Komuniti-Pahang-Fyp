from rest_framework import serializers
from .models import DonationRequest

class DonationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationRequest
        fields = ['name', 'email', 'description']

class getDonationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationRequest
        fields = ['id','name', 'email', 'description', 'date', 'status']