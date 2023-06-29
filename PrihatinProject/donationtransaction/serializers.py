from rest_framework import serializers
from .models import DonationTransaction

class DonationTransactionSerializer(serializers.ModelSerializer):
    donation_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    class Meta:
        model = DonationTransaction
        fields = ['amount', 'donation_date', 'donation_type','purpose', 'donor_name']


class getDonationTransactionSerializer(serializers.ModelSerializer):
    donation_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    purpose = serializers.SerializerMethodField()
    class Meta:
        model = DonationTransaction
        fields = ['id','amount', 'donation_date', 'donation_type', 'purpose', 'donor_name']
    
    def get_purpose(self, obj):
        return obj.get_purpose_display()

