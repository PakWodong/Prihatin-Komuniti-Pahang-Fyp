from django.db import models

# Create your models here.

class DonationRequest(models.Model): #Donation request model for the system
    name = models.CharField(max_length=100)
    email = models.EmailField()
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=100, default='Pending')

    def __str__(self): #return string reprentation of name
        return self.name 
