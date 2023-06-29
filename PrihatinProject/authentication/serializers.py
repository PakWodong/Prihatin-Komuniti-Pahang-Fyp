from rest_framework import serializers
from .models import StaffOfPrihatinKomunitiPahang, Community, User
from rest_framework.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        if User.objects.filter(email=data.get('email')).exists():
            raise ValidationError('Email already exists')
        elif User.objects.filter(username=data.get('username')).exists():
            raise ValidationError('Username already exists')
        return data
    
    def create(self, validated_data):
        email = validated_data.get('email')
        username = validated_data.get('username')
        password = validated_data.get('password')
        user = User.objects.create_user(email=email, username=username, password=password)
        return user


class CommunitySerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    
    class Meta:
        model = Community
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    
    class Meta:
        model = StaffOfPrihatinKomunitiPahang
        fields = '__all__'


