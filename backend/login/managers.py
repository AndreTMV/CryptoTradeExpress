from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError 
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _ 

class CustomUserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email (email)
        except ValidationError:
            raise ValueError (_("Debes proporcionar un email valido"))

    def create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError(_("Debes proporcionar un usuario"))
        if email:
            email = self.normalize_email(email) 
            self.email_validator(email)
        else:
            raise ValueError(_("El email es requerido"))

        user = self.model(
            username = username,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        user.save()
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("superuser debe ser verdadero"))

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("superuser debe ser staff"))

        if not password:
            raise ValueError(_("Usuarios moderadores deben tener contraseña"))

        if email:
            email = self.normalize_email(email) 
            self.email_validator(email)
        else:
            raise ValueError(_("El email es requerido"))

        user = self.create_user( username=username,email=email, password=password, **extra_fields)
        user.save()
        return user

        

