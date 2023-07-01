import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics,status
from rest_framework.permissions import AllowAny
from .serializers import CommunitySerializer,UserSerializer
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.contrib.auth import authenticate, get_user_model
from django.core.mail import send_mail
from django.utils.html import strip_tags
from rest_framework.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from authentication.models import Users

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):  #send the email and password for login
        email = request.data.get('email') 
        password = request.data.get('password')
        user = authenticate(email=email, password=password) #authenticate user into the application

        if user:  
            refresh = RefreshToken.for_user(user)
            if user.is_admin:  #detect user is staff or admin
                return Response({  #return the response json object if email and password exist in the database to the frontend
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'isAdmin': True,
                    'user_id': user.id,
                    

                })
            else: #detect user is community
                return Response({ #return the response json object if email and password exist in the database to the frontend
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'isAdmin': False,
                    'user_id': user.id,
                    'username':user.username,
                    'email':user.email,
                })
        else:
            registered_email = Users.objects.filter(email=email).exists()  #check if email exist in database
            if registered_email:
                return Response({'error': 'Password does not match with registered email'}, status=401)  #if yes, send response error password does not match with email
            else:
                return Response({'error': 'Email does not registered in the system'}, status=401) #if no, send response email does not registered

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            print(refresh_token)
            token = RefreshToken(refresh_token)
            print(token)

            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class SampleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'You are Authenticate!'})
    
class CommunityRegistrationView(generics.CreateAPIView):
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]

    def post(self, request):
        user_data = request.data.get('user')
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            community_data = request.data
            community_data['user'] = user.id
            community_serializer = CommunitySerializer(data=community_data)
            if community_serializer.is_valid():
                community_serializer.save()
                return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
            else:
                user.delete()
                return Response(community_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            errors = user_serializer.errors
            if 'email' in errors:
                message = 'Email already exists'
            elif 'username' in errors:
                message ='Username already exists'
            else:
                message = errors
            print(message)
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)




        
class ForgotPassword(APIView):
    def post(self, request):
        email = request.data.get('email')
        if email:
            try:
                user_model = get_user_model()
                user = user_model.objects.get(email=email)
            except Users.DoesNotExist:
                return Response({'success': False, 'error': 'No user with this email address was found.'})
            else:
                token_generator = default_token_generator
                token = token_generator.make_token(user)
                reset_link = f'http://localhost:3000/reset/{email}'
                html_content = f'<html><body><p>Click the button below to reset your password:</p><br><a href="{reset_link}" style="background-color: #008CBA; color: white; padding: 12px 24px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-size: 16px;">Reset Password</a></body></html>'
                plain_content = strip_tags(html_content)
                subject = 'Reset your password'
                from_email = 'prihatin@gmail.com'
                recipient_list = [email]
                send_mail(subject, plain_content, from_email, recipient_list, html_message=html_content)

                return Response({'success': True,'message':'Please click the button that has been send to your email to reset your password'},status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'error': 'Email is required.'})


class ResetPassword(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if email and password:
            try:
                user_model = get_user_model()
                user = user_model.objects.get(email=email)
            except user_model.DoesNotExist:
                return Response({'success': False, 'error': 'Invalid Email Address'})
            else:
                if user.check_password(password):  
                    return Response({'success': False, 'error': 'New password must be different from the current password'})
                else:
                    user.set_password(password)
                    user.save()
                    return Response({'success': True, 'message': 'Email Reset Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'error': 'Email and password are required'})

