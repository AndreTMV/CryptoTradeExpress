from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import CryptoSerializer

# linear regresion libraries
import ccxt
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from matplotlib.dates import AutoDateLocator
import matplotlib.dates as mdates
import mpld3
# Create your views here.

def generate_graph(crypto):
    binance = ccxt.binance()
    symbol = f'{crypto}/USDT'  # Cambia el simbolo a la criptomoneda que quieras analizar
    timeframe = '1d'     # Intervalo de tiempo diario

    # Obtenemos datos historicos de Binance
    ohlcv = binance.fetch_ohlcv(symbol, timeframe)
    df = pd.DataFrame(
        ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])

    # Usar el precio de cierre (close) como variable independiente (X)
    X = df['close'].values.reshape(-1, 1)

    # Establecer una variable de tiempo (dias) como variable independiente (X)
    X_days = np.arange(1, len(X) + 1).reshape(-1, 1)

    # La variable dependiente (y) es el precio de cierre del dia siguiente
    y = X[1:]

    # Eliminar el ultimo dia de X_days para que coincida con la longitud de y
    X_days = X_days[:-1]

    # Crear el modelo de regresion lineal
    model = LinearRegression()

    # Entrenar el modelo con todos los datos
    model.fit(X_days, y)

    # Realizar predicciones para los proximos 500 dias
    num_days_future = 500
    X_future = np.arange(len(X) + 1, len(X) + 1 + num_days_future).reshape(-1, 1)
    y_future_pred = model.predict(X_future)

    # Visualizar los resultados
    fig = Figure() 
    ax = fig.subplots()
    # Graficar los precios historicos
    ax.scatter(X_days, y, color='blue', label='Historico')
    # Graficar las predicciones para los proximos 500 dias
    ax.scatter(X_future, y_future_pred, color='green', label='Predicciones')
    ax.plot(np.concatenate((X_days, X_future)), np.concatenate(
        (y, y_future_pred)), color='black', linestyle='-', label='Regresion Lineal')
    ax.set_xlabel('Dias')
    ax.set_ylabel('Precio de Cierre (USD)')
    ax.set_title(f'Precio de {crypto} y Predicciones')
    ax.legend()
    ax.grid(True)


    plot_json = mpld3.fig_to_dict(fig)
    return plot_json

def generate_last_10_days_graph(crypto):
    # Configurar la API de Binance
    binance = ccxt.binance()
    symbol = f'{crypto}/USDT'  # Cambia el simbolo a la criptomoneda que quieras analizar
    timeframe = '1d'     # Intervalo de tiempo diario

    # Obtener datos historicos de Binance
    # Limitamos a los ultimos 500 dias
    ohlcv = binance.fetch_ohlcv(symbol, timeframe, limit=10)
    df = pd.DataFrame(
        ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])

    # convertir la marca de tiempo a formato de fecha
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

    # Visualizar los datos historicos
    fig = Figure()
    ax = fig.subplots()
    ax.plot(df['timestamp'], df['close'], color='blue')
    ax.set_xlabel('Fecha')
    ax.set_ylabel('Precio de Cierre')
    ax.set_title(f'Precio de {crypto} en los ultimos 10 dias')
    ax.xaxis.set_major_locator(AutoDateLocator())

    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
    ax.xaxis.set_tick_params(rotation=45)


    ax.grid(True)

    plot_json = mpld3.fig_to_dict(fig)
    plot_json['data']['data01'] = list(zip(df['timestamp'].dt.strftime('%Y-%m-%d').tolist(), df['close'].tolist()))
    return plot_json

@api_view(['GET'])
def get_cryptos(request):
    try:
        exchange = ccxt.binance({
                # 'verbose': True,
                'enableRateLimit': True,
            })
        exchange.load_markets()
        currencies = exchange.currencies
        cryptos = set()
        for currencie in currencies:
            cryptos.add(currencie)
        cryptos_list = sorted(cryptos)

        serializer = CryptoSerializer(data={'cryptos': cryptos_list})
        serializer.is_valid(raise_exception=True)
        serialized_data = serializer.data

        return Response(serialized_data, status=200)
    except Exception as e:
            return Response({'error':str(e)}, status=500)

@api_view(['GET'])
def send_graph_data(request):
    crypto = request.query_params.get('crypto')
    if crypto:
        try:
            graph_json = generate_graph(crypto)
            return Response(graph_json, status=200)
        except Exception as e:
             return Response({'error':str(e)}, status=500)
    else:
         return Response({'error':'debes proporcionar una cripto'}, status=400)

@api_view(['GET'])
def send_graph_data_last(request):
    crypto = request.query_params.get('crypto')
    if crypto:
        try:
            graph_json = generate_last_10_days_graph(crypto)
            return Response(graph_json, status=200)
        except Exception as e:
             return Response({'error':str(e)}, status=500)
    else:
         return Response({'error':'debes proporcionar una cripto'}, status=400)
