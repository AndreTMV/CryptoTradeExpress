from django.shortcuts import render
from login.models import User, API_TOKEN
from rest_framework.decorators import api_view 
from rest_framework.response import Response
from binance.spot import Spot
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
@api_view(['GET'])
def get_binance_info(request):
    user_id = request.query_params.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'Usuario no encontrado'}, status=404)
        
        api_keys = API_TOKEN.objects.get(user=user)
        api_key = str(api_keys.api_key)
        api_secret=str(api_keys.secret_key)

        client = Spot(api_key,api_secret)
        balances = client.account()['balances']
        user_cryptos = {}
        crypto_values_in_usd = {}
        account_info = client.account()
        crypto_predictions = {}
        binance = ccxt.binance()
        for balance in balances:
            asset = balance['asset']
            free_amount = float(balance['free'])
            if free_amount: 
                user_cryptos[asset] = free_amount 
                if asset != 'USDT':
                    try:
                        symbol = f"{asset}USDT"
                        price_info = client.ticker_price(symbol)
                        price_in_usdt = float(price_info['price'])
                    except:
                        # Handle case where the symbol might not exist
                        price_in_usdt = 0
 
                else:
                    price_in_usdt = 1  # 1 USDT is 1 USD
                
                crypto_values_in_usd[asset] = free_amount * price_in_usdt
                if asset != 'USDT': 
                    try:
                        # Obtenemos datos históricos de Binance
                        symbol_ccxt = f'{asset}/USDT'
                        timeframe = '1d'  # Intervalo de tiempo diario
                        ohlcv = binance.fetch_ohlcv(symbol_ccxt, timeframe)
                        df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])

                        # Usar el precio de cierre (close) como variable independiente (X)
                        X = df['close'].values.reshape(-1, 1)
                        
                        # Establecer una variable de tiempo (días) como variable independiente (X)
                        X_days = np.arange(1, len(X) + 1).reshape(-1, 1)
                        
                        # La variable dependiente (y) es el precio de cierre del día siguiente
                        y = X[1:]
                        
                        # Eliminar el último día de X_days para que coincida con la longitud de y
                        X_days = X_days[:-1]
                        
                        # Crear el modelo de regresión lineal
                        model = LinearRegression()
                        
                        # Entrenar el modelo con todos los datos
                        model.fit(X_days, y)
                        
                        # Realizar predicciones para los próximos 500 días
                        num_days_future = 500
                        X_future = np.arange(len(X) + 1, len(X) + 1 + num_days_future).reshape(-1, 1)
                        y_future_pred = model.predict(X_future)
                        
                        # Comparar el último precio predicho con el precio actual
                        
                        last_predicted_price = y_future_pred[-1][0] 
                        current_price = price_in_usdt
                        
                        # Determinar el color basado en la comparación
                        if last_predicted_price > current_price:
                            color = 'green'
                        else:
                            color = 'red'
                        
                        crypto_predictions[asset] = {
                            'current_price': current_price,
                            'predicted_price': last_predicted_price,
                            'color': color
                        }
                    except Exception as e:
                        crypto_predictions[asset] = {
                            'error': str(e)
                        }

        return Response({
            "crypto_balances": user_cryptos,
            "crypto_values_in_usd": crypto_values_in_usd,
            "crypto_predictions": crypto_predictions,
        }, status=200)
    else:
        return Response({'Debes proporcionar un id'}, status=400)
        
