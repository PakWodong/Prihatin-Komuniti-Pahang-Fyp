from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
urlpatterns = [

     path('token/', jwt_views.TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
     path('token/refresh/', jwt_views.TokenRefreshView.as_view(),
         name='token_refresh'),
     path('', include('authentication.urls')),
     path('donation/', include('donationrequest.urls')),
     path('donationtransaction/',include('donationtransaction.urls')),
     path('donationactivity/',include('donationactivity.urls'))
]
