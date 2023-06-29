from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model


User = get_user_model()

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            print(email)
            print(password+"help")
            user = User.objects.get(email=email)
            print(f"User found: {user}")
            print(user.password)
        except User.DoesNotExist:
            print("User not found")
            return None

        if not user.check_password(password):
            print("Invalid password")
            return None

        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

