# from django.shortcuts import render
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from .serializer import CryptoSerializer
#
# # linear regresion libraries
# import ccxt
# import pandas as pd
# import numpy as np
# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_squared_error, r2_score
# import matplotlib.pyplot as plt
# from matplotlib.figure import Figure
# from matplotlib.dates import AutoDateLocator
# import matplotlib.dates as mdates
# import mpld3
# # Create your views here.
#
# def generate_graph(crypto):
#     binance = ccxt.binance()
#     symbol = f'{crypto}/USDT'  # Cambia el simbolo a la criptomoneda que quieras analizar
#     timeframe = '1d'     # Intervalo de tiempo diario
#
#     # Obtenemos datos historicos de Binance
#     ohlcv = binance.fetch_ohlcv(symbol, timeframe)
#     df = pd.DataFrame(
#         ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
#
#     # Usar el precio de cierre (close) como variable independiente (X)
#     X = df['close'].values.reshape(-1, 1)
#
#     # Establecer una variable de tiempo (dias) como variable independiente (X)
#     X_days = np.arange(1, len(X) + 1).reshape(-1, 1)
#
#     # La variable dependiente (y) es el precio de cierre del dia siguiente
#     y = X[1:]
#
#     # Eliminar el ultimo dia de X_days para que coincida con la longitud de y
#     X_days = X_days[:-1]
#
#     # Crear el modelo de regresion lineal
#     model = LinearRegression()
#
#     # Entrenar el modelo con todos los datos
#     model.fit(X_days, y)
#
#     # Realizar predicciones para los proximos 500 dias
#     num_days_future = 500
#     X_future = np.arange(len(X) + 1, len(X) + 1 + num_days_future).reshape(-1, 1)
#     y_future_pred = model.predict(X_future)
#
#     # Visualizar los resultados
#     fig = Figure()
#     ax = fig.subplots()
#     # Graficar los precios historicos
#     ax.scatter(X_days, y, color='blue', label='Historico')
#     # Graficar las predicciones para los proximos 500 dias
#     ax.scatter(X_future, y_future_pred, color='green', label='Predicciones')
#     ax.plot(np.concatenate((X_days, X_future)), np.concatenate(
#         (y, y_future_pred)), color='black', linestyle='-', label='Regresion Lineal')
#     ax.set_xlabel('Dias')
#     ax.set_ylabel('Precio de Cierre (USD)')
#     ax.set_title(f'Precio de {crypto} y Predicciones')
#     ax.legend()
#     ax.grid(True)
#
#
#     plot_json = mpld3.fig_to_dict(fig)
#     return plot_json
#
# def generate_last_10_days_graph(crypto):
#     # Configurar la API de Binance
#     binance = ccxt.binance()
#     symbol = f'{crypto}/USDT'  # Cambia el simbolo a la criptomoneda que quieras analizar
#     timeframe = '1d'     # Intervalo de tiempo diario
#
#     # Obtener datos historicos de Binance
#     # Limitamos a los ultimos 500 dias
#     ohlcv = binance.fetch_ohlcv(symbol, timeframe, limit=10)
#     df = pd.DataFrame(
#         ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
#
#     # convertir la marca de tiempo a formato de fecha
#     df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
#
#     # Visualizar los datos historicos
#     fig = Figure()
#     ax = fig.subplots()
#     ax.plot(df['timestamp'], df['close'], color='blue')
#     ax.set_xlabel('Fecha')
#     ax.set_ylabel('Precio de Cierre')
#     ax.set_title(f'Precio de {crypto} en los ultimos 10 dias')
#     ax.xaxis.set_major_locator(AutoDateLocator())
#
#     ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
#     ax.xaxis.set_tick_params(rotation=45)
#
#
#     ax.grid(True)
#
#     plot_json = mpld3.fig_to_dict(fig)
#     plot_json['data']['data01'] = list(zip(df['timestamp'].dt.strftime('%Y-%m-%d').tolist(), df['close'].tolist()))
#     return plot_json
#
# @api_view(['GET'])
# def get_cryptos(request):
#     try:
#         exchange = ccxt.binance({
#                 # 'verbose': True,
#                 'enableRateLimit': True,
#             })
#         exchange.load_markets()
#         currencies = exchange.currencies
#         cryptos = set()
#         for currencie in currencies:
#             cryptos.add(currencie)
#         cryptos_list = sorted(cryptos)
#
#         serializer = CryptoSerializer(data={'cryptos': cryptos_list})
#         serializer.is_valid(raise_exception=True)
#         serialized_data = serializer.data
#
#         return Response(serialized_data, status=200)
#     except Exception as e:
#             return Response({'error':str(e)}, status=500)
#
# @api_view(['GET'])
# def send_graph_data(request):
#     crypto = request.query_params.get('crypto')
#     if crypto:
#         try:
#             graph_json = generate_graph(crypto)
#             return Response(graph_json, status=200)
#         except Exception as e:
#              return Response({'error':str(e)}, status=500)
#     else:
#          return Response({'error':'debes proporcionar una cripto'}, status=400)
#
# @api_view(['GET'])
# def send_graph_data_last(request):
#     crypto = request.query_params.get('crypto')
#     if crypto:
#         try:
#             graph_json = generate_last_10_days_graph(crypto)
#             return Response(graph_json, status=200)
#         except Exception as e:
#              return Response({'error':str(e)}, status=500)
#     else:
#          return Response({'error':'debes proporcionar una cripto'}, status=400)
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

import ccxt
import pandas as pd
import numpy as np

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from datetime import timedelta

# -----------------------------
# Config ccxt (una sola instancia)
# -----------------------------
EXCHANGE = ccxt.binance({
    'enableRateLimit': True,
})

# -----------------------------
# Helpers
# -----------------------------


def _build_symbol(crypto_or_symbol: str) -> str:
    """
    Acepta 'BTC' o 'BTC/USDT'. Si no tiene '/', asume /USDT.
    """
    s = (crypto_or_symbol or "").upper().strip()
    return s if '/' in s else f'{s}/USDT'


def _fetch_ohlcv_df(symbol: str, timeframe: str = '1d', limit: int = 500) -> pd.DataFrame:
    """
    Regresa DataFrame con columnas: timestamp (datetime UTC), open, high, low, close, volume
    """
    ohlcv = EXCHANGE.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    df = pd.DataFrame(
        ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
    )
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms', utc=True)
    return df


def _timeframe_delta(timeframe: str) -> timedelta:
    """
    Convierte timeframe ccxt (ej. '1d', '4h', '15m') a timedelta.
    """
    seconds = EXCHANGE.parse_timeframe(timeframe)  # devuelve segundos
    return timedelta(seconds=seconds)

# -----------------------------
# Endpoints
# -----------------------------


@api_view(['GET'])
def get_cryptos(request):
    """
    Regresa el listado de cryptos (prefiltradas a las que tienen par /USDT).
    GET /api/cryptos
    """
    try:
        EXCHANGE.load_markets()
        # Símbolos estilo 'BTC/USDT', 'ETH/USDT', etc.
        symbols = [s for s in EXCHANGE.symbols if s.endswith('/USDT')]
        cryptos = sorted({s.split('/')[0] for s in symbols})
        return Response({'cryptos': cryptos}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def send_series_last(request):
    """
    Sustituye tu 'send_graph_data_last': ahora solo datos.
    GET /api/series/last?crypto=BTC&limit=10&timeframe=1d
    Respuesta: { symbol, timeframe, series: [{t, close}, ...] }
    """
    crypto = request.query_params.get('crypto')
    timeframe = request.query_params.get('timeframe', '1d')
    limit = int(request.query_params.get('limit', 10))

    if not crypto:
        return Response({'error': 'debes proporcionar ?crypto='}, status=status.HTTP_400_BAD_REQUEST)

    try:
        symbol = _build_symbol(crypto)
        df = _fetch_ohlcv_df(symbol, timeframe=timeframe, limit=limit)

        series = [
            {
                't': ts.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'close': float(c)
            }
            for ts, c in zip(df['timestamp'], df['close'])
        ]

        return Response({
            'symbol': symbol,
            'timeframe': timeframe,
            'series': series
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def send_close_regression(request):
    """
    Sustituye tu 'send_graph_data': ahora solo datos + predicciones lineales (opcional).
    GET /api/series/regression?crypto=BTC&timeframe=1d&limit=500&horizon=500

    Respuesta:
    {
      symbol, timeframe,
      historical: { t: [...], close: [...] },
      regression: {
        model: 'linear',
        horizon,
        future: { t: [...], close: [...] },
        metrics: { rmse, r2 },
        coefficients: { slope, intercept }
      }
    }
    """
    crypto = request.query_params.get('crypto')
    timeframe = request.query_params.get('timeframe', '1d')
    limit = int(request.query_params.get('limit', 500))
    horizon = int(request.query_params.get('horizon', 500))

    if not crypto:
        return Response({'error': 'debes proporcionar ?crypto='}, status=status.HTTP_400_BAD_REQUEST)

    try:
        symbol = _build_symbol(crypto)
        df = _fetch_ohlcv_df(symbol, timeframe=timeframe, limit=limit)

        # ——— Regresión lineal simple sobre índice temporal (1..N-1) prediciendo close del día siguiente
        if len(df) < 3:
            return Response({'error': 'No hay suficientes datos para la regresión.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # y = close desplazado (precio del día siguiente)
        y = df['close'].values[1:].reshape(-1, 1)  # (N-1, 1)
        X_days = np.arange(1, len(df)).reshape(-1, 1)  # 1..N-1

        model = LinearRegression().fit(X_days, y)

        # Para métricas: predicción sobre el tramo observado (1..N-1)
        y_pred_fit = model.predict(X_days).ravel()
        rmse = float(mean_squared_error(y.ravel(), y_pred_fit, squared=False))
        r2 = float(r2_score(y.ravel(), y_pred_fit))

        # Predicciones a futuro: N+1 .. N+horizon
        X_future = np.arange(len(df) + 1, len(df) + 1 + horizon).reshape(-1, 1)
        y_future = model.predict(X_future).ravel().tolist()

        # Fechas futuras a partir del último timestamp real
        td = _timeframe_delta(timeframe)
        last_ts = df['timestamp'].iloc[-1]
        future_ts = [(last_ts + td * i).strftime('%Y-%m-%dT%H:%M:%SZ')
                     for i in range(1, horizon + 1)]

        resp = {
            'symbol': symbol,
            'timeframe': timeframe,
            'historical': {
                't': df['timestamp'].dt.strftime('%Y-%m-%dT%H:%M:%SZ').tolist(),
                'close': [float(x) for x in df['close'].tolist()]
            },
            'regression': {
                'model': 'linear',
                'horizon': horizon,
                'future': {
                    't': future_ts,
                    'close': [float(v) for v in y_future]
                },
                'metrics': {
                    'rmse': rmse,
                    'r2': r2
                },
                'coefficients': {
                    'slope': float(model.coef_.ravel()[0]),
                    'intercept': float(model.intercept_.ravel()[0])
                }
            }
        }
        return Response(resp, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
