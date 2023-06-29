from django.db import models

class DonationTransaction(models.Model):
    DONATION_TYPES = (
        ('donor', 'Donor'),
        ('recipient', 'Recipient'),
    )
    
    PURPOSE_CHOICES = (
        ('education', 'Education Support'),
        ('flood_relief', 'Flood Relief'),
        ('empowering_live', 'Empowering Live'),
        ('tuition_program', 'Tuition Program'),
    )
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateTimeField()
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPES)
    donor_name = models.CharField(max_length=255)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
