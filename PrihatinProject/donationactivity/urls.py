from django.urls import path
from .views import VolunteerActivityView,PictureView, VolunteerParticipantManage,VolunteerParticipantView,VolunteerRegisteredView # view that link with url
app_name = 'donationactivity'

urlpatterns = [
    path('addEvent/', VolunteerActivityView.as_view(), name='volunteerActivityAdd'), # handle volunteer activity url
    path('deleteimage/',PictureView.as_view(),name='deleteimage'), #handle image store in the system url
    path('volunteerParticipant/',VolunteerParticipantView.as_view(),name='volunteerParticipant'), # handle volunteer participant for activity url
    path('ParticipantManage/<int:param>',VolunteerParticipantManage.as_view(),name='ParticipantManage'),
    path ('VolunteerRegistered/<int:param>',VolunteerRegisteredView.as_view(),name='volunteerRegistered') # get specific volunteer activity url
]
