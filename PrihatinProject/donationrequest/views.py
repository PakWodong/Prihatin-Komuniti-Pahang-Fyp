from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import DonationRequestSerializer,getDonationRequestSerializer
from django.core.mail import send_mail
from.models import DonationRequest
from django.shortcuts import get_object_or_404

class DonationRequestView(APIView): # to use restful API class to get the data

    def get(self,request): #to get all the donation request from the database
        donation_requests = DonationRequest.objects.all()  
        serializer = getDonationRequestSerializer(donation_requests, many=True) #use serializer class to get data from model
        return Response(serializer.data) #return all the donation request in Json Response
    

    def post(self, request): # to post a new donation request to the system and database
        try:
            #check whether data from frontend is sufficient to create a new donation request
            serializer = DonationRequestSerializer(data=request.data) 
            if serializer.is_valid(): # if data sufficient
                donation_request = serializer.save()
                
                from_email = donation_request.email  
                print(from_email)
                subject = 'I need donation'
                message = donation_request.description
                print(message)
                recipient_list = ['wanluqman@graduate.utm.my']
                send_mail(subject, message, from_email, recipient_list) #send the donation request to staff of Prihatin Komuniti Pahang
                #return success equal to true if manage to create new donation request
                return Response({'success': True, 'message': 'Donation request sent successfully'}, status=status.HTTP_201_CREATED)
            else:
                #return success equal to false if failed to create new donation request
                return Response({'success': False, 'error': 'Invalid data format'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            #return success equal to false if something wrong with the server
            return Response({'success': False, 'error': 'An error occurred while sending donation request'}, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request,):
     try:
        id = request.data.get('id')
        donation_request = get_object_or_404(DonationRequest, id=id)
        email = request.data.get('email')
        reason = request.data.get('reason')
        from_email = ['wanluqman@graduate.utm.my']
        subject = 'Reason to Accept/Reject donation request'
        message = reason
        recipient_list = ['wanluqman@graduate.utm.my']
        
        try:
            send_mail(subject, message, from_email, recipient_list)
        except Exception as e:
            print(f"An error occurred while sending the email: {str(e)}")
        
        donation_request.status = request.data.get('status', donation_request.status)
        donation_request.save()
        
        return Response({'success': True, 'message': 'Donation request updated successfully'}, status=status.HTTP_200_OK)

     except:
        return Response({'success': False, 'error': 'An error occurred while updating the donation request'}, status=status.HTTP_400_BAD_REQUEST)





