import bcrypt
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

    def make_random_password(self):
        return bcrypt.gensalt().decode()

    def check_password(self, password, encoded):
        return bcrypt.checkpw(password.encode(), encoded.encode())

class Users(AbstractBaseUser):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)
    username = models.CharField(max_length=30, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', default=timezone.now)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

class StaffOfPrihatinKomunitiPahang(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    staffid = models.CharField(max_length=30)

class Community(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    contact_number = models.CharField(max_length=30)
    location = models.CharField(max_length=30)
    profession = models.CharField(max_length=30)

