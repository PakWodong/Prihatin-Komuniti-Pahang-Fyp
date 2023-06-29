from django.urls import path
from .views import DonationRequestView

app_name = 'donationrequest'

urlpatterns = [
    path('request/',DonationRequestView.as_view(),name='donationrequest')
]