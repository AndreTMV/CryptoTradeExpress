import time
from django.shortcuts import render
from .serializer import CompraSerializer, VentaSerializer 
from .models import Compra, Venta
from login.models import User, API_TOKEN
from rest_framework import viewsets
from django.db.models import F, ExpressionWrapper, DecimalField
from datetime import datetime, timedelta
from django.db.models import Sum
from django.db.models.functions import TruncMonth
import pandas as pd
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from matplotlib.dates import AutoDateLocator
import matplotlib.dates as mdates
import mpld3
from django.core.mail import send_mail
from binance.lib.utils import config_logging
from binance.websocket.spot.websocket_stream import SpotWebsocketStreamClient
from binance.websocket.spot.websocket_stream import SpotWebsocketStreamClient
from binance.websocket.spot.websocket_api import SpotWebsocketAPIClient
import logging
from binance.spot import Spot as Client
from binance.lib.utils import config_logging
from binance.error import ClientError
import pandas as pd
from pandas import json_normalize
import logging
import mpld3
import threading
from binance.spot import Spot as client
import requests
import json
# Configuración de logging para Binance

config_logging(logging, logging.DEBUG, log_file='./binance.log')

crypto_prices = {}
client_id = ""

def consultar_transacciones(fecha_inicial, fecha_final, usuario):
    # Validar las fechas
    # fecha_actual = timezone.now().date()
    # if fecha_inicial > fecha_actual or fecha_final > fecha_actual:
    #     raise ValueError("Las fechas no pueden ser posteriores a la fecha actual")
    if fecha_inicial > fecha_final:
        raise ValueError("La fecha inicial no puede ser posterior a la fecha final")

    # Realizar la consulta de transacciones
    transacciones = (
        Compra.objects.filter(user=usuario, date__range=[fecha_inicial, fecha_final])
        .annotate(
            ganancia=ExpressionWrapper(
                F('venta__selling_price') - F('buying_price'),
                output_field=DecimalField(max_digits=10, decimal_places=3)
            )
        )
        .values('date', 'buying_price', 'venta__compra__criptomoneda_bought', 'venta__date', 'venta__selling_price', 'venta__criptomoneda_sold', 'ganancia')
    )
    # Convertir a BUSD si es necesario
    # for transaccion in transacciones:
    #     if transaccion['ganancia'] < 0:
    #         transaccion['ganancia'] = convertir_a_busd(transaccion['ganancia'])

    return transacciones

def graficar_transacciones(transacciones):
    fechas = [t['date'] for t in transacciones]
    ganancias = [t['ganancia'] for t in transacciones]
    # Visualizar los resultados
    fig = Figure() 
    ax = fig.subplots()
    ax.bar(fechas, ganancias, align='center', alpha=0.7)
    ax.set_xlabel('Fecha de la transaccion')
    ax.set_ylabel('Ganancia')
    ax.set_title('Ganancias por transaccion')
    ax.legend()
    ax.grid(True)

    plot_json = mpld3.fig_to_dict(fig)
    return plot_json

def transformar_fecha(numero):
    return datetime.utcfromtimestamp(numero).strftime('%Y-%m-%d')

def convertir_timestamp_a_fecha(timestamp):
    return datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d')

def adaptar_json_plotly(json_data):
    # Convertir timestamps a fechas
    for key, values in json_data['data'].items():
        for i in range(len(values)):
            json_data['data'][key][i][0] = convertir_timestamp_a_fecha(values[i][0])

    # Reorganizar datos para Plotly
    data = []
    for key, values in json_data['data'].items():
        x_data = [value[0] for value in values]  # Fechas convertidas
        y_data = [value[1] for value in values]
        data.append({'x': x_data, 'y': y_data, 'type': 'bar', 'name': key})

    # Construir layout para Plotly
    layout = {
        'title': json_data['axes'][0]['texts'][2]['text'],
        'xaxis': {'title': json_data['axes'][0]['texts'][0]['text']},
        'yaxis': {'title': json_data['axes'][0]['texts'][1]['text']}
    }

    return {'data': data, 'layout': layout}

def consultar_ganancias_por_mes(fecha_inicial, fecha_final, usuario):
    if fecha_inicial > fecha_final:
        raise ValueError("La fecha inicial no puede ser posterior a la fecha final")

    ganancias_por_mes = (
        Compra.objects.filter(user=usuario, date__range=[fecha_inicial, fecha_final])
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(ganancia_total=Sum(F('venta__selling_price') - F('buying_price')))
        .order_by('month')
    )

    return ganancias_por_mes
# Create your views here.
class CompraView(viewsets.ModelViewSet):
    serializer_class = CompraSerializer
    queryset = Compra.objects.all()

class VentaView(viewsets.ModelViewSet):
    serializer_class = VentaSerializer
    queryset = Venta.objects.all()

@api_view(['GET'])
def datos_transacciones(request):
    fecha_inicial_str = request.query_params.get('fecha_inicial')
    fecha_final_str = request.query_params.get('fecha_final')
    user = request.query_params.get('user')
    if fecha_inicial_str and fecha_final_str and user:
        try:
            fecha_inicial = datetime.strptime(fecha_inicial_str, '%Y-%m-%d').date()
            fecha_final = datetime.strptime(fecha_final_str, '%Y-%m-%d').date()
            df = consultar_transacciones(fecha_inicial, fecha_final, user)
            return Response(df, status=200)
        except Exception as e:
            return Response({'error':str(e)}, status=500)
    else:
        return Response({'error':'debes proporcionar fechas validas'}, status=400)

@api_view(['GET'])
def datos_transacciones_grafica1(request):
    fecha_inicial_str = request.query_params.get('fecha_inicial')
    fecha_final_str = request.query_params.get('fecha_final')
    user = request.query_params.get('user')
    if fecha_inicial_str and fecha_final_str and user:
        try:
            fecha_inicial = datetime.strptime(fecha_inicial_str, '%Y-%m-%d').date()
            fecha_final = datetime.strptime(fecha_final_str, '%Y-%m-%d').date()
            df = consultar_transacciones(fecha_inicial, fecha_final, user)
            graph_json = graficar_transacciones(df)
            print(graph_json)
            new_json = adaptar_json_plotly(graph_json)
            return Response(new_json, status=200)
        except Exception as e:
            return Response({'error':str(e)}, status=500)
    else:
        return Response({'error':'debes proporcionar fechas validas'}, status=400)

@api_view(['GET'])
def ganancias_por_mes(request):
    fecha_inicial_str = request.query_params.get('fecha_inicial')
    fecha_final_str = request.query_params.get('fecha_final')
    user = request.query_params.get('user')
    if fecha_inicial_str and fecha_final_str and user:
        try:
            fecha_inicial = datetime.strptime(fecha_inicial_str, '%Y-%m-%d').date()
            fecha_final = datetime.strptime(fecha_final_str, '%Y-%m-%d').date()
            ganancias_mes = consultar_ganancias_por_mes(fecha_inicial, fecha_final, user)
            return Response(ganancias_mes, status=200)
        except Exception as e:
            return Response({'error':str(e)}, status=500)
    else:
        return Response({'error':'debes proporcionar fechas validas'}, status=400)



######################################################################################



def get_symbol_filters(symbol):
    url = 'https://api.binance.com/api/v3/exchangeInfo'
    response = requests.get(url)
    data = response.json()

    symbols = data.get('symbols', [])
    print("Symbol en filtros", symbol)
    for sym in symbols:
        if sym['symbol'] == symbol:
            return sym['filters']
    return None

def adjust_to_step(value, step):
    return round(value / step) * step

def adjust_to_precision(value, precision):
    format_str = "{:0." + str(precision) + "f}"
    return float(format_str.format(value))

def validate_and_adjust_order(symbol, quantity, price=None, order_type="LIMIT"):
    try:
        filters = get_symbol_filters(symbol)
        if filters is None:
            raise ValueError(f"Filters not found for symbol: {symbol}")

        symbol_info = get_symbol_info(symbol)
        if not symbol_info:
            raise ValueError(f"Symbol info not found for symbol: {symbol}")

        adjusted_quantity = quantity
        adjusted_price = price

        quantity_precision = symbol_info['baseAssetPrecision']
        price_precision = symbol_info['quotePrecision']

        for f in filters:
            if f['filterType'] == 'PRICE_FILTER' and price is not None:
                min_price = float(f['minPrice'])
                max_price = float(f['maxPrice'])
                tick_size = float(f['tickSize'])
                if price < min_price or price > max_price:
                    raise ValueError(f"Price {price} out of range [{min_price}, {max_price}] for symbol {symbol}")
                adjusted_price = adjust_to_step(price, tick_size)
                adjusted_price = adjust_to_precision(adjusted_price, price_precision)


            if f['filterType'] == 'LOT_SIZE':
                min_qty = float(f['minQty'])
                max_qty = float(f['maxQty'])
                step_size = float(f['stepSize'])
                if quantity < min_qty or quantity > max_qty:
                    raise ValueError(f"Quantity {quantity} out of range [{min_qty}, {max_qty}] for symbol {symbol}")
                adjusted_quantity = adjust_to_step(quantity, step_size)
                adjusted_quantity = adjust_to_precision(adjusted_quantity, quantity_precision)


            if f['filterType'] == 'NOTIONAL' and price is not None:
                min_notional = float(f['minNotional'])
                notional = adjusted_quantity * adjusted_price
                if notional < min_notional:
                    raise ValueError(f"Notional {notional} less than minimum notional {min_notional} for symbol {symbol}")

        return adjusted_quantity, adjusted_price

    except Exception as e:
        logging.error(f"Error in validate_and_adjust_order: {e}")
        raise



def message_handler(_, message):
    data_dict = eval(message)
    df = json_normalize(data_dict)
    global client_id
    crypto_prices[client_id] = float(df['c'])

def send_alert_email(email, subject, message):
    from_email = "info@crypto-trade-express.com"  # Debe ser una dirección de correo electrónico válida configurada en tus settings.py
    send_mail(subject, message, from_email, [email])



def get_symbol_info(crypto):
    url = 'https://api.binance.com/api/v3/exchangeInfo'

    response = requests.get(url)
    data = response.json()  # Convierte la respuesta de texto en un objeto JSON

    symbols = data.get('symbols', [])
    for symbol in symbols:
        if symbol['symbol'] == crypto:
            symbol_info = {
                'symbol': symbol['symbol'],
                'status': symbol['status'],
                'baseAsset': symbol['baseAsset'],
                'baseAssetPrecision': symbol['baseAssetPrecision'],
                'quoteAsset': symbol['quoteAsset'],
                'quotePrecision': symbol['quotePrecision'],
                'quoteAssetPrecision': symbol['quoteAssetPrecision'],
                'baseCommissionPrecision': symbol['baseCommissionPrecision'],
                'quoteCommissionPrecision': symbol['quoteCommissionPrecision'],
                'orderTypes': symbol['orderTypes'],
                'icebergAllowed': symbol['icebergAllowed'],
                'ocoAllowed': symbol['ocoAllowed'],
                'otoAllowed': symbol['otoAllowed'],
                'quoteOrderQtyMarketAllowed': symbol['quoteOrderQtyMarketAllowed'],
                'allowTrailingStop': symbol['allowTrailingStop'],
                'cancelReplaceAllowed': symbol['cancelReplaceAllowed'],
                'isSpotTradingAllowed': symbol['isSpotTradingAllowed'],
                'isMarginTradingAllowed': symbol['isMarginTradingAllowed'],
                'filters': symbol['filters'],
                'permissions': symbol['permissions'],
                'permissionSets': symbol['permissionSets'],
                'defaultSelfTradePreventionMode': symbol['defaultSelfTradePreventionMode'],
                'allowedSelfTradePreventionModes': symbol['allowedSelfTradePreventionModes']
            }
            return symbol_info
    return None




def pairs_available():
    url = 'https://api.binance.com/api/v3/exchangeInfo'

    response = requests.get(url)
    data = response.json()  # Convierte la respuesta de texto en un objeto JSON

    symbols = data.get('symbols', [])

    symbol_info_list = []

    for symbol in symbols:
        # Extraer la informacion relevante de cada simbolo
        symbol_info = {
            'symbol': symbol['symbol'],
            'status': symbol['status'],
            'baseAsset': symbol['baseAsset'],
            'baseAssetPrecision': symbol['baseAssetPrecision'],
            'quoteAsset': symbol['quoteAsset'],
            'quotePrecision': symbol['quotePrecision'],
            'quoteAssetPrecision': symbol['quoteAssetPrecision'],
            'baseCommissionPrecision': symbol['baseCommissionPrecision'],
            'quoteCommissionPrecision': symbol['quoteCommissionPrecision'],
            'orderTypes': symbol['orderTypes'],
            'icebergAllowed': symbol['icebergAllowed'],
            'ocoAllowed': symbol['ocoAllowed'],
            'otoAllowed': symbol['otoAllowed'],
            'quoteOrderQtyMarketAllowed': symbol['quoteOrderQtyMarketAllowed'],
            'allowTrailingStop': symbol['allowTrailingStop'],
            'cancelReplaceAllowed': symbol['cancelReplaceAllowed'],
            'isSpotTradingAllowed': symbol['isSpotTradingAllowed'],
            'isMarginTradingAllowed': symbol['isMarginTradingAllowed'],
            'filters': symbol['filters'],
            'permissions': symbol['permissions'],
            'permissionSets': symbol['permissionSets'],
            'defaultSelfTradePreventionMode': symbol['defaultSelfTradePreventionMode'],
            'allowedSelfTradePreventionModes': symbol['allowedSelfTradePreventionModes']
        }
        symbol_info_list.append(symbol_info)

    return symbol_info_list

@api_view(['GET'])
def get_pairs(request):
    url = 'https://api.binance.com/api/v3/exchangeInfo'

    response = requests.get(url)
    data = response.json()  # Convierte la respuesta de texto en un objeto JSON

    symbols = data.get('symbols', [])
    symbol_names = [symbol['symbol'] for symbol in symbols]
    return Response(symbol_names)

@api_view(['POST'])
def comprar_vender(request):
    user_id = request.data.get('user')
    if not user_id:
        return Response({'error': 'Debes proporcionar un usuario válido'}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)

    criptomoneda_bought = request.data.get('buy_this_crypto')
    criptomoneda_sold = request.data.get('sell_this_crypto')
    date = datetime.today()
    max_percentage = request.data.get('max_percentage')
    min_percentage = request.data.get('min_percentage')
    cuantity = request.data.get('quantity')
    side = request.data.get('side')


    if not (criptomoneda_bought and criptomoneda_sold and max_percentage and min_percentage and cuantity):
        return Response({"error": "Debes proporcionar datos válidos"}, status=400)

    if float(max_percentage) <= 0 or float(min_percentage) <= 0:
        return Response({'error': 'Los porcentajes de pérdida y ganancia deben ser mayores a 0'}, status=400)

    symbol_info_list = pairs_available()
    symbols_list = [symbol['symbol'] for symbol in symbol_info_list]

    if (f"{criptomoneda_bought}{criptomoneda_sold}" in symbols_list) or ((f"{criptomoneda_sold}USDT" in symbols_list) and (f"{criptomoneda_bought}USDT" in symbols_list)) or (f"{criptomoneda_sold}{criptomoneda_bought}" in symbols_list):
        new_compra = Compra(
            user=user,
            criptomoneda_bought=criptomoneda_bought,
            criptomoneda_sold=criptomoneda_sold,
            date=date,
            max_percentage_lost=max_percentage,
            min_percentage_gain=min_percentage,
            buying_price=0,
            cuantity_bought=cuantity
        )
        new_compra.save()

        new_venta = Venta(
            user=user,
            compra=new_compra,
            criptomoneda_sold=criptomoneda_sold,
            criptomoneda_bought=criptomoneda_bought,
            date=date,
            selling_price=0,
            cuantity_sold=cuantity,
            max_percentage_lost=max_percentage,
            min_percentage_gain=min_percentage
        )
        new_venta.save()

        message = f"Se ha iniciado una transacción para comprar {criptomoneda_bought} y vender {criptomoneda_sold}."
        send_alert_email(user.email, "Transacción abierta", message)

        monitoring_active = [True]
        spot_websocket_client = SpotWebsocketStreamClient(on_message=message_handler)

        if side == 'compra':
            print("compra")
            threading.Thread(target=monitor_price_and_buy, args=(new_compra, monitoring_active, spot_websocket_client), daemon=True).start()
        elif side =='venta':
            print("venta")
            threading.Thread(target=monitor_price_and_sell, args=(new_venta, monitoring_active, spot_websocket_client), daemon=True).start()
        else:
            print("Opcion no valida")

        return Response({'status': 'Compra y venta iniciadas y monitoreo en curso'}, status=201)
    else:
        return Response({'error': 'Una de las criptomonedas no está disponible en Binance'}, status=400)

def monitor_price(instance, monitoring_active, my_client, action):
    crypto = instance.criptomoneda_bought.lower() if action == "sell" else instance.criptomoneda_bought.lower()
    if crypto == 'usdt':
        crypto = instance.criptomoneda_sold

    global client_id 
    client_id = f"{instance.id} - {crypto}" 
    print(f"Iniciando monitoreo para {action}")

    start_time = datetime.now()
    api_keys = API_TOKEN.objects.get(user=instance.user)
    api_key = str(api_keys.api_key)
    api_secret = str(api_keys.secret_key)
    client = Client(api_key, api_secret)
    starter_price_data = client.ticker_price(f"{crypto.upper()}USDT")
    starter_price = float(starter_price_data['price'])
    print(starter_price)
    print(Client)

    while monitoring_active[0]:
        my_client.mini_ticker(symbol=f"{crypto}usdt")
        time.sleep(1)
        print(f"Monitoreando el precio de {crypto}")

        if crypto_prices.get(client_id) is not None:
            current_price = crypto_prices[client_id]
            if current_price is not None:
                print(f"Precio actual: {current_price}, max pérdida: {instance.max_percentage_lost}, min ganancia: {instance.min_percentage_gain}")
                target_price_loss = (instance.max_percentage_lost / 100) * starter_price
                target_price_gain = (instance.min_percentage_gain / 100) * starter_price
                if current_price == target_price_loss or current_price == target_price_gain:
                    handle_trade(instance, client, current_price, action, crypto)
                    monitoring_active[0] = False
                    break


        if (datetime.now() - start_time) > timedelta(days=3):
            email = instance.user.email
            message = f"El precio de {crypto} no alcanzó los porcentajes establecidos dentro de los 3 días. La operación ha sido cancelada."
            send_alert_email(email, f"Cancelación de {action} de {crypto}", message)
            instance.delete()
            monitoring_active[0] = False
            break

    print(f"Deteniendo monitoreo de {action}")

def handle_trade(instance, client, current_price, action, crypto):
    try:
        if action == "sell":
            symbol = f"{instance.criptomoneda_sold}{instance.criptomoneda_bought}"
            side = "SELL"
            quantity = instance.cuantity_sold
        else:
            symbol = f"{instance.criptomoneda_bought}{instance.criptomoneda_sold}"
            side = "BUY"
            quantity = instance.cuantity_bought

        symbol_info_list = pairs_available()
        symbols_list = [symbol['symbol'] for symbol in symbol_info_list]

        if symbol in symbols_list:
            print("compra normal")
            place_order(client, symbol, side, "MARKET", quantity, current_price, instance, action, crypto)
        else:
            print("compra transformar")
            handle_alternative_trade(instance, client, current_price, action, crypto)
        
    except (ClientError, ValueError) as error:
        logging.error(f"Error in placing {action} order: {error}")
        email = instance.user.email
        message = f"No se ha podido efectuar la operación por estas razones: {str(error)}"
        send_alert_email(email, f"Cancelación de {action} de {instance.criptomoneda_bought if action == 'buy' else instance.criptomoneda_sold}", message)
        if action == 'sell':
            instance.compra.delete()
        instance.delete()

def handle_alternative_trade(instance, client, current_price, action, crypto):
    try:
        if action == "sell":
            sell_crypto_to_usdt_sell(instance, client, current_price)
            buy_crypto_from_usdt_sell(instance, client, current_price)
            email = instance.user.email
            message = f"Se ha ejecutado una venta de {instance.criptomoneda_sold} para comprar {instance.criptomoneda_bought} a un precio de {current_price} USD."
            send_alert_email(email, f"{action.capitalize()} de {crypto} ejecutada", message)
        else:
            sell_crypto_to_usdt_buy(instance, client, current_price)
            buy_crypto_from_usdt_buy(instance, client, current_price)
            email = instance.user.email
            message = f"Se ha ejecutado una compra de {instance.criptomoneda_bought} para vender {instance.criptomoneda_sold} a un precio de {current_price} USD."
            send_alert_email(email, f"{action.capitalize()} de {crypto} ejecutada", message)

    except (ClientError, ValueError) as error:
        logging.error(f"Error in placing alternative {action} order: {error}")
        email = instance.user.email
        # message = f"No se ha podido efectuar la operación por estas razones: {str(error.status_code)}, {error.error_code}, {error.error_message}"
        message = f"No se ha podido efectuar la operación por estas razones: {str(error)}"
        send_alert_email(email, f"Cancelación de {action} de {instance.criptomoneda_sold if action == 'sell' else instance.criptomoneda_bought}", message)
        if action == 'sell':
            instance.comra.delete()
        instance.delete()

def sell_crypto_to_usdt_sell(instance, client, current_price):
    stock = f"{instance.criptomoneda_bought}USDT"
    price_info = client.ticker_price(stock)
    price_in_usdt = float(price_info['price'])
    total_dl = instance.cuantity_sold * price_in_usdt
    stock = f"{instance.criptomoneda_sold}USDT"
    price_info = client.ticker_price(stock)
    price_in_usdt = float(price_info['price'])
    total_amount_to_sell = total_dl / price_in_usdt
    print(f"sell {total_amount_to_sell} total dl: {total_dl}")

    params = {
        "symbol": f"{instance.criptomoneda_sold}USDT",
        "side": "SELL",
        "type": "MARKET",
        "quantity": total_amount_to_sell,
        "recvWindow": 5000,
    }
    adjusted_quantity, _ = validate_and_adjust_order(params['symbol'], params['quantity'], price_in_usdt)
    params['quantity'] = adjusted_quantity
    print("venta:", params)
    instance.cuantity_sold = adjusted_quantity
    instance.selling_price = price_in_usdt
    instance.save()

    response = client.new_order(**params)
    logging.info(response)

def buy_crypto_from_usdt_sell(instance, client, current_price):
    stock = f"{instance.criptomoneda_bought}USDT"
    price_info = client.ticker_price(stock)
    price_in_usdt = float(price_info['price'])
    total_amount_to_buy = instance.cuantity_sold * price_in_usdt

    params = {
        "symbol": f"{instance.criptomoneda_bought}USDT",
        "side": "BUY",
        "type": "LIMIT",
        "quantity": instance.cuantity_sold,
        "price": current_price,
        "recvWindow": 5000,
        "timeInForce": "GTC",
    }
    adjusted_quantity, adjusted_price = validate_and_adjust_order(params['symbol'], params['quantity'], current_price)
    params['quantity'] = adjusted_quantity
    params['price'] = format(adjusted_price, '.8f')

    print("compra:", params)
    instance.compra.cuantity_bought = adjusted_quantity
    instance.compra.buying_price = adjusted_price
    instance.compra.save()
    response = client.new_order(**params)
    logging.info(response)

def sell_crypto_to_usdt_buy(instance, client, current_price):
    stock = f"{instance.criptomoneda_bought}USDT"
    price_info = client.ticker_price(stock)
    price_in_usdt = float(price_info['price'])
    total_dl = instance.cuantity_bought * price_in_usdt
    stock = f"{instance.criptomoneda_sold}USDT"
    price_info = client.ticker_price(stock)
    price_in_usdt = float(price_info['price'])
    total_amount_to_sell = total_dl / price_in_usdt
    print(f"sell {total_amount_to_sell} total dl: {total_dl}")

    params = {
        "symbol": f"{instance.criptomoneda_sold}USDT",
        "side": "SELL",
        "type": "MARKET",
        "quantity": total_amount_to_sell,
        "recvWindow": 5000,
    }
    adjusted_quantity, _ = validate_and_adjust_order(params['symbol'], params['quantity'], current_price)
    params['quantity'] = adjusted_quantity
    venta = Venta.objects.get(compra=instance)
    venta.cuantity_sold = adjusted_quantity
    venta.selling_price = price_in_usdt
    venta.save()
    print("venta:", params)

    response = client.new_order(**params)
    logging.info(response)

def buy_crypto_from_usdt_buy(instance, client, current_price):
    stock = f"{instance.criptomoneda_bought}USDT"
    price_info = client.ticker_price(stock)
    price_in_usdt = float(price_info['price'])
    total_amount_to_buy = instance.cuantity_bought * price_in_usdt

    params = {
        "symbol": f"{instance.criptomoneda_bought}USDT",
        "side": "BUY",
        "type": "LIMIT",
        "quantity": instance.cuantity_bought,
        "price": current_price,
        "recvWindow": 5000,
        "timeInForce": "GTC",
    }
    adjusted_quantity, adjusted_price = validate_and_adjust_order(params['symbol'], params['quantity'], current_price)
    params['quantity'] = adjusted_quantity
    params['price'] = format(adjusted_price, '.8f')

    print("compra:", params)
    instance.cuantity_bought = adjusted_quantity
    instance.buying_price = adjusted_price
    instance.save()
    response = client.new_order(**params)
    logging.info(response)

def place_order(client, symbol, side, order_type, quantity, current_price, instance, action, crypto):
    params = {
        "symbol": symbol,
        "side": side,
        "type": order_type,
        "quantity": quantity,
        "recvWindow": 5000,
    }
    if order_type == "LIMIT":
        params["price"] = current_price
        params["timeInForce"] = "GTC"
    
    adjusted_quantity, adjusted_price = validate_and_adjust_order(params['symbol'], params['quantity'], current_price)
    params['quantity'] = adjusted_quantity
    if order_type == "LIMIT":
        params['price'] = format(adjusted_price, '.8f')

    print(f"{action}:", params)
    response = client.new_order(**params)
    logging.info(response)

    if action == "sell":
        instance.selling_price = format(current_price, '.8f')
        instance.compra.buying_price = format(current_price, '.8f') 
        instance.compra.save()
    else:
        instance.buying_price = format(current_price, '.8f')
        venta = Venta.objects.get(compra=instance)
        venta.selling_price = format(current_price, '.8f')
        venta.save()

    instance.save()

    email = instance.user.email
    message = f"Se ha ejecutado una {action} de {crypto} a un precio de {current_price} USD."
    send_alert_email(email, f"{action.capitalize()} de {crypto} ejecutada", message)

# Ejemplos de uso de las funciones refactorizadas
def monitor_price_and_sell(instance, monitoring_active, my_client):
    monitor_price(instance, monitoring_active, my_client, "sell")

def monitor_price_and_buy(instance, monitoring_active, my_client):
    monitor_price(instance, monitoring_active, my_client, "buy")



@api_view(['GET'])
def obtener_compras(request):
    user_id = request.query_params.get('user')
    if not user_id:
        return Response({'error': 'Debes proporcionar un usuario válido'}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)

    compras = Compra.objects.exclude(user=user)
    compras_data = [
        {
            'user': compra.user.username,
            'criptomoneda_bought': compra.criptomoneda_bought,
            'criptomoneda_sold': compra.criptomoneda_sold,
            'date': compra.date,
            'buying_price': compra.buying_price,
            'max_percentage_lost': compra.max_percentage_lost,
            'min_percentage_gain': compra.min_percentage_gain,
            'cuantity_bought': compra.cuantity_bought
        }
        for compra in compras
    ]
    return Response(compras_data, status=200)

@api_view(['GET'])
def obtener_ventas(request):
    user_id = request.query_params.get('user')
    if not user_id:
        return Response({'error': 'Debes proporcionar un usuario válido'}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)

    ventas = Venta.objects.exclude(user=user)
    ventas_data = [
        {
            'criptomoneda_sold': venta.criptomoneda_sold,
            'criptomoneda_bought': venta.criptomoneda_bought,
            'date': venta.date,
            'selling_price': venta.selling_price,
            'cuantity_sold': venta.cuantity_sold,
            'max_percentage_lost': venta.max_percentage_lost,
            'min_percentage_gain': venta.min_percentage_gain
        }
        for venta in ventas
    ]
    return Response(ventas_data, status=200)
