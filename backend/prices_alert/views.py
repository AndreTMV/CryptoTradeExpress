from django.shortcuts import render
from rest_framework import viewsets
from .serializer import PriceAlertSerializer
from .models import PriceAlertSpecs
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from datetime import date, datetime, timedelta
import logging
import time
from binance.lib.utils import config_logging
from binance.websocket.spot.websocket_stream import SpotWebsocketStreamClient
from django.core.mail import send_mail
import pandas as pd
from pandas import json_normalize
import threading
config_logging(logging, logging.DEBUG, log_file='./logfile.log')
crypto_prices = {}
client_id = ""

# Create your views here.
class PriceAlertView(viewsets.ModelViewSet):
    serializer_class = PriceAlertSerializer
    queryset = PriceAlertSpecs.objects.all()

def message_handler(_, message):
    data_dict = eval(message)
    df = json_normalize(data_dict)
    global client_id
    crypto_prices[client_id] = float(df['c'])
    
def send_alert_email(email, crypto, price):
    subject = f"{crypto} ha alcanzado un precio dentro de los rangos que definiste!"
    message = f"Precio actual de {crypto}: {price}"
    from_email = "info@crypto-trade-express.com"  # Debe ser una dirección de correo electrónico válida configurada en tus settings.py
    to_email = email

    send_mail(subject, message, from_email, [to_email])

def send_cancel_email(email, crypto, price):
    subject = f"Cancelacion del monitoreo de: {crypto}"
    message = f"{crypto} no alcanzo ha estar dentro de los rangos de precio que estableciste :(. \nPrecio de {crypto} al detener el monitoreo: {price}"
    from_email = "info@crypto-trade-express.com"  # Debe ser una dirección de correo electrónico válida configurada en tus settings.py
    to_email = email

    send_mail(subject, message, from_email, [to_email])

def time_until_next_date(instance):
    today = date.today()
    min_date = instance.min_date
    max_date = instance.max_date

    if today < min_date:
        return (min_date - today).days * 86400  
    elif today > max_date:
        return 0  
    else:
        return None 


def watch_crypto_task(instance, monitoring_active, my_client, latest_price=None):
    crypto = instance.cripto.lower()
    global client_id 
    client_id = f"{instance.id} - {crypto}" 
    print("Iniciando monitoreo")

    while monitoring_active[0]:
        today = date.today()
        if today <= instance.max_date:
            if instance.min_date <= today:
                my_client.mini_ticker(symbol=f"{crypto}usdt")
                time.sleep(1)
                print(f"monitoreando el precio de {crypto}")

                if crypto_prices.get(client_id) is not None:
                    latest_price = crypto_prices[client_id]
                    if latest_price is not None:
                        print(f"latest_price: {latest_price}, min price: {instance.min_price}, max price: {instance.max_price}")
                        if instance.min_price <= latest_price <= instance.max_price:
                            email = instance.user.email
                            send_alert_email(email, crypto, latest_price)
                            instance.is_active = False
                            instance.save()
                            my_client.mini_ticker(
                                symbol=f"{crypto}usdt", action=SpotWebsocketStreamClient.ACTION_UNSUBSCRIBE
                            )
                            monitoring_active[0] = False
            else:
                time_until_min_date = time_until_next_date(instance)
                print(f"Esperando a que sea le fecha de min date, faltan:  {time_until_min_date} segundos")
                time.sleep(time_until_min_date)
        else:
            instance.is_active = False
            instance.save()
            monitoring_active[0] = False
            email = instance.user.email
            latest_price = crypto_prices[client_id]
            send_alert_email(email, crypto, latest_price)
            print("El dia actual ha sobrepasado el rango de fechas")

    print("Deteniendo monitoreo")

@receiver(post_save, sender=PriceAlertSpecs)
def start_watch_crypto_task(sender, instance, created, **kwargs):
    if created and instance.is_active:
        monitoring_active = [True]
        spot_websocket_client = SpotWebsocketStreamClient(on_message=message_handler)
        threading.Thread(target=watch_crypto_task, args=(instance, monitoring_active, spot_websocket_client), daemon=True).start()