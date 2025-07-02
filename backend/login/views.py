from django.shortcuts import render
import os
import random
import math
import string
# Rest Framework Imports
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models.signals import post_save 
from django.dispatch import receiver

from .managers import CustomUserManager

# Twilio Imports
# from twilio.rest import Client

# Models Import
from .models import User, OTPVerification, API_TOKEN
from django.contrib.auth import get_user_model
from amigos.models import FriendList

# Djoser Imports
from djoser.conf import settings

# Errors
from django.db import IntegrityError
from django.core.mail import send_mail

def send_otp_email(email, otp):
    subject = "Código de verificación OTP"
    message = f"Tu código de verificación OTP es: {otp}"
    from_email = "info@crypto-trade-express.com"  # Debe ser una dirección de correo electrónico válida configurada en tus settings.py
    to_email = email

    send_mail(subject, message, from_email, [to_email])

# Generating OTP
def generateOTP():
    # Combinar números y letras
    characters = string.ascii_letters + string.digits
    # Generar clave aleatoria de longitud 7
    OTP = ''.join(random.choice(characters) for _ in range(7))
    return OTP

# Endpoint para generar OTP
@api_view(['GET', 'POST'])
def otpGeneration(request):
    email = request.data.get('email')
    if email:
        generatedOTP = generateOTP()
        data = OTPVerification(email=email, otp=generatedOTP)
        data.save()
        send_otp_email(email, generatedOTP)
        return Response({"OTPSent": True})
    else:
        return Response({"OTPSent": False})

@api_view(['PUT'])
def checkOTP(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    if email and otp:
        try:
            otp_verification = OTPVerification.objects.get(email=email, otp=otp)
            if otp_verification.is_verified:
                # El OTP ya ha sido verificado antes
                return Response({"status": True}, status=200)
            else:
                # Marcar el OTP como verificado
                otp_verification.is_verified = True
                otp_verification.save()
                return Response({"status": True}, status=200)
        except OTPVerification.DoesNotExist:
            return Response({"status": False}, status=400)  # OTP incorrecto
    else:
        return Response({"status": False}, status=400)  # Datos faltantes

@api_view(['GET'])
def check_username_exists(request):
    username = request.query_params.get('username', None)
    User = get_user_model()

    if username:
        username_exists = User.objects.filter(username=username).exists()
        return Response({'exists': username_exists})

    return Response({'error': 'Debes proporcionar un username en los parámetros de consulta.'}, status=400)

@api_view(['GET'])
def check_email_exists(request):
    email = request.query_params.get('email', None)
    User = get_user_model()

    if email:
        email_exists = User.objects.filter(email=email).exists()
        return Response({'exists': email_exists})

    return Response({'error': 'Debes proporcionar un email en los parámetros de consulta.'}, status=400)

@api_view(['GET'])
def user_is_staff(request):
    username = request.query_params.get('username', None)
    User = get_user_model()

    if username:
        try:
            user = User.objects.get(username=username)
            if user.is_staff:
                return Response({"El usuario es moderador"}, status=200)
            else:
                return Response({"El usuario no es moderador"}, status=400)
        except User.DoesNotExist:
            return Response({"El usuario no existe"}, status=400)

    return Response({'error': 'Debes proporcionar un usuario en los parámetros de consulta.'}, status=400)



@receiver(post_save, sender=User)
def create_friend_list(sender, instance, **kwargs):
    try:
        # Intenta obtener el FriendList asociado con el usuario
        friend_list = FriendList.objects.get(user=instance)
    except FriendList.DoesNotExist:
        # Si no existe, crea uno nuevo
        friend_list = FriendList.objects.create(user=instance)
        friend_list.friends.set([])


@api_view(['GET'])
def check_tokens(request):
    user_id = request.query_params.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"El usuario no existe"}, status=404)

        if user:
            api = API_TOKEN.objects.filter(user=user).exists()

            return Response({'exists':api})

    else:
        return Response({'Debes brindar un usuario'}, status=400)

@api_view(['POST'])
def set_tokens(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"El usuario no existe"}, status=404)

        secret_key = request.data.get('secret')
        api_key = request.data.get('key')
        
        tokens = API_TOKEN(
            user = user,
            api_key = api_key,
            secret_key = secret_key
        )

        tokens.save()
        return Response(status=200)
    else:
        return Response({'Debes brindar un usuario'}, status=400)

@api_view(['DELETE'])
def remove_tokens(request):
    user_id = request.query_params.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"El usuario no existe"}, status=404)

        tokens = API_TOKEN.objects.get(user=user)
        if tokens:
            tokens.delete()
            return Response(status=200)
        else:
            return Response({'no api keys'}, status=404)

    else:
        return Response({'Debes brindar un usuario'}, status=400)