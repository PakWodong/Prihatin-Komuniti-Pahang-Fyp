from django.urls import path
from .views import DonationTransactionView,PaymentView,PaymentIntent,payment_fpx_view # view that link with url
app_name = 'donationtransaction'

urlpatterns = [
    path('add/',DonationTransactionView.as_view(),name='addNewTransaction'), # handle donation transaction url
    path('payment/',PaymentView.as_view(),name='payment'), # manage payment url in the backend 
    path('paymentInfo/',PaymentIntent.as_view(),name='PaymentIntent'), # create a payment intent url in the backend 
    path('paymentFpx/', payment_fpx_view, name='paymentFpx'),
]
