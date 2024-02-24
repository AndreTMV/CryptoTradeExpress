from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.utils.crypto import get_random_string


# Create your models here.

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(_('Username'), max_length=50, unique=True)
    email = models.EmailField(_('Email'), max_length=254, unique = True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _('User') 
        verbose_name_plural = _('Users')

    def __str__(self) -> str:
        return self.email
    
    @property
    def get_full_name(self):
        return f"{self.username} {self.email}"

# * Table that stores the OTP and is verfied or not
class OTPVerification(models.Model):
    email = models.EmailField(_('Email'), max_length=254)
    otp = models.CharField(max_length=7, default=get_random_string(length=7, allowed_chars='abcdefghijklmnopqrstuvwxyz0123456789'))
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.email