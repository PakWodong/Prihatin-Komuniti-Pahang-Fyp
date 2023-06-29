from rest_framework import serializers
from django.utils import timezone
from .models import VolunteerActivity, VolunteerActivityImage, VolunteerParticipant


class VolunteerActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerActivity
        fields = '__all__'


class VolunteerActivityImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerActivityImage
        fields = '__all__'


class VolunteerParticipantSerializer(serializers.ModelSerializer):
    
    def get_num_participants(self, activity):
        return VolunteerParticipant.objects.filter(activity=activity).count()
    
    class Meta:
        model = VolunteerParticipant
        exclude = ['date']

class getVolunteerParticipantSerializer(serializers.ModelSerializer):
    
    def get_num_participants(self, activity):
        return VolunteerParticipant.objects.filter(activity=activity).count()
    
    class Meta:
        model = VolunteerParticipant
        fields = '__all__'