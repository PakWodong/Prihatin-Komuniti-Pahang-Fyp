from django.db import models
from django.utils import timezone
from django.conf import settings
User = settings.AUTH_USER_MODEL

class VolunteerActivity(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    fees = models.DecimalField(max_digits=8, decimal_places=2)
    time_start = models.TimeField()
    time_end = models.TimeField()
    venue = models.CharField(max_length=255)
    status = models.CharField(max_length=255)

from .models import VolunteerActivity

class VolunteerActivityImage(models.Model):
    activity = models.ForeignKey(
        VolunteerActivity,
        on_delete=models.CASCADE,
        related_name='images'
    )
    filename = models.CharField(max_length=255)

    def __str__(self):
        return self.filename



class VolunteerParticipant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    status = models.CharField(max_length=255)
    date = models.DateField(default=timezone.now)
    description = models.TextField()
    activity = models.ForeignKey(VolunteerActivity, on_delete=models.CASCADE, related_name='participants')
