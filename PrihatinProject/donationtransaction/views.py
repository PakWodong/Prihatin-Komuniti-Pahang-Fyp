from django.conf import settings
from rest_framework import status
from .serializers import DonationTransactionSerializer, getDonationTransactionSerializer
from .models import DonationTransaction
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import stripe
import traceback
from datetime import datetime
from decimal import Decimal
from django.shortcuts import redirect

stripe.api_key = settings.STRIPE_SECRET_KEY

# Create your views here.


# to use restful API class to get the data
class DonationTransactionView(APIView):

    def get(self, request):  # to get all the donation transaction from the database
        donation_transactions = DonationTransaction.objects.all()
        # use serializer class to get data from model
        serializer = getDonationTransactionSerializer(
            donation_transactions, many=True)
        # return all the donation request in Json Response
        return Response(serializer.data)

    def post(self, request):  # to post a new donation transaction to the system and database
        try:
            # check whether data from frontend is sufficient to create a new donation transaction
            serializer = DonationTransactionSerializer(data=request.data)
            if serializer.is_valid():  # if data sufficient
                serializer.save()
                # return success equal to true if manage to create new donation transaction
                return Response({'success': True, 'message': 'Donation transaction created successfully'}, status=status.HTTP_201_CREATED)
            else:
                # return success equal to false if failed to create new donation transaction
                return Response({'success': False, 'error': 'Invalid data format'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            # return success equal to false if something wrong with the server
            return Response({'success': False, 'error': 'An error occurred while creating donation transaction'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):  # to delete the donation transaction from database
        try:
            id = request.data.get('id')  # to get the specific ID
            # filter donation transaction based on ID and then delete
            donation_transaction = DonationTransaction.objects.get(id=id)
            donation_transaction.delete()
            # return success equal to true if manage to delete new donation transaction
            return Response({'success': True, 'message': 'Donation transaction deleted successfully'})
        except DonationTransaction.DoesNotExist:
            # return success equal to false if donation transaction does not exist
            return Response({'success': False, 'error': 'Donation transaction not found'}, status=status.HTTP_404_NOT_FOUND)
        except:
            # return success equal to false if something wrong with the server
            return Response({'success': False, 'error': 'An error occurred while deleting donation transaction'}, status=status.HTTP_400_BAD_REQUEST)


class PaymentView(APIView):
    def post(self, request):
        try:
            amount = request.data.get('amount')
            donor_name = request.data.get('donar_name')
            purpose = request.data.get('purpose')
            donation_data = {
                'amount': amount,
                'donation_date':  datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
                'donor_name': donor_name,
                'donation_type': 'donor',
                'purpose': purpose,
            }
            serializer = DonationTransactionSerializer(data=donation_data)

            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Donation transaction saved successfully.'})

            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(traceback.format_exc())
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentIntent(APIView):
    def post(self, request):
        try:
            amount = request.data.get('amount')
            print(amount)
            intent = stripe.PaymentIntent.create(
                amount=amount,  # The amount in cents
                currency='myr',  # The currency code
                payment_method_types=['card', 'fpx']
            )
            return JsonResponse({'clientSecret': intent.client_secret})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


def payment_fpx_view(request):
    donor_name = request.GET.get('donorName')
    amount = request.GET.get('amount')
    purpose = request.GET.get('purpose')
    data = {
        'donar_name': donor_name,
        'amount': amount,
    }

    if request.method == 'GET':
        payment_intent_id = request.GET.get('payment_intent')

        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        payment_status = payment_intent.status

        if payment_status == 'succeeded':
            donation_data = {
                'amount': amount,
                'donation_date': datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
                'donor_name': donor_name,
                'donation_type': 'donor',
                'purpose': purpose,
            }
            serializer = DonationTransactionSerializer(data=donation_data)
            if serializer.is_valid():
                serializer.save()
                redirect_url = f"{settings.FRONTEND_URL}/paymentSuccessfull?donorName={donor_name}&amount={amount}"
                return redirect(redirect_url)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            redirect_url = f"{settings.FRONTEND_URL}/paymentFailed?donorName={donor_name}&amount={amount}"
            return redirect(redirect_url)
