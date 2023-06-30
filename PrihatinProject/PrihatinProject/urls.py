from django.contrib import admin
from django.urls import path, include,re_path
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView
urlpatterns = [

     path('token/', jwt_views.TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
     path('token/refresh/', jwt_views.TokenRefreshView.as_view(),
         name='token_refresh'),
     path('', include('authentication.urls')),
     path('donation/', include('donationrequest.urls')),
     path('donationtransaction/',include('donationtransaction.urls')),
     path('donationactivity/',include('donationactivity.urls')),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
