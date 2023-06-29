from django.urls import path
from .views import LoginView, ResetPassword, SampleView,CommunityRegistrationView,LogoutView,ForgotPassword # view that link with url

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'), #user authentication and authorization url
    path('sample/', SampleView.as_view(), name='sample'), #to make sure only authenticated user can access the system url
    path('register/', CommunityRegistrationView.as_view(), name='community_register'), #register community into the application url
    path('logout/', LogoutView.as_view(), name='logout'), #logout user from application url
    path('forgot_password/',ForgotPassword.as_view(), name='forgot_password'), # handle forgot password backend url
    path('resetpassword/',ResetPassword.as_view(), name='resetpassword') #handle reset password backend url
]