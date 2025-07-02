import decimal
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import requests
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from .models import PrecioBitcoin

def obtener_precios_historicos():
    url = "https://api.binance.com/api/v3/klines"
    params = {
        'symbol': 'BTCUSDT',
        'interval': '1d',
        'limit': 100
    }
    response = requests.get(url, params=params)
    data = response.json()
    precios = [float(entry[4]) for entry in data]  # Precio de cierre
    return precios

def preparar_datos(precios, look_back=1):
    X, y = [], []
    for i in range(len(precios) - look_back - 1):
        a = precios[i:(i + look_back)]
        X.append(a)
        y.append(precios[i + look_back])
    return np.array(X), np.array(y)

def crear_modelo_lstm(look_back):
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(look_back, 1)))
    model.add(LSTM(50))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def entrenar_modelo_lstm():
    precios = obtener_precios_historicos()
    precios = np.array(precios).reshape(-1, 1)

    scaler = MinMaxScaler(feature_range=(0, 1))
    precios_escalados = scaler.fit_transform(precios)

    look_back = 10
    X, y = preparar_datos(precios_escalados, look_back)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    model = crear_modelo_lstm(look_back)
    model.fit(X, y, epochs=20, batch_size=1, verbose=2)

    return model, scaler, look_back

def predecir_precios(model, scaler, look_back, dias_a_predecir=50, simulacion=None):
    precios = obtener_precios_historicos()
    precios = np.array(precios).reshape(-1, 1)
    precios_escalados = scaler.transform(precios)

    predicciones = []
    input_data = precios_escalados[-look_back:]
    input_data = np.reshape(input_data, (1, look_back, 1))

    for _ in range(dias_a_predecir):
        prediccion = model.predict(input_data)
        predicciones.append(prediccion[0][0])
        input_data = np.concatenate((input_data[:, 1:, :], np.array(prediccion).reshape(1, 1, 1)), axis=1)

    predicciones = scaler.inverse_transform(np.array(predicciones).reshape(-1, 1)).flatten().tolist()

    if simulacion:
        ultima_fecha = PrecioBitcoin.objects.filter(simulacion=simulacion).latest('fecha').fecha
        for i, precio in enumerate(predicciones):
            fecha = ultima_fecha + timedelta(days=i+1)
            PrecioBitcoin.objects.create(simulacion=simulacion, fecha=fecha, precio=precio)

    return predicciones

# def obtener_precios_historicos_bd(simulacion, look_back=100):
#     precios = PrecioBitcoin.objects.filter(simulacion=simulacion).order_by('-fecha')[:look_back]
#     precios = list(precios)[::-1]  # Invertir el orden para obtener precios cronológicamente
#     return [precio.precio for precio in precios]

# def predecir_precios_bd(model, scaler, look_back, dias_a_predecir=31, simulacion=None):
#     precios = obtener_precios_historicos_bd(simulacion, look_back)
#     precios = np.array(precios).reshape(-1, 1)
#     precios_escalados = scaler.transform(precios)

#     predicciones = []
#     input_data = precios_escalados[-look_back:]
#     input_data = np.reshape(input_data, (1, look_back, 1))

#     for _ in range(dias_a_predecir):
#         prediccion = model.predict(input_data)
#         predicciones.append(prediccion[0][0])
#         input_data = np.concatenate((input_data[:, 1:, :], np.array(prediccion).reshape(1, 1, 1)), axis=1)

#     predicciones = scaler.inverse_transform(np.array(predicciones).reshape(-1, 1)).flatten().tolist()

#     if simulacion:
#         ultima_fecha = PrecioBitcoin.objects.filter(simulacion=simulacion).latest('fecha').fecha
#         for i, precio in enumerate(predicciones):
#             fecha = ultima_fecha + timedelta(days=i+1)
#             PrecioBitcoin.objects.create(simulacion=simulacion, fecha=fecha, precio=decimal.Decimal(precio))

#     return predicciones

def obtener_precios_historicos_bd(simulacion, look_back=100):
    precios = PrecioBitcoin.objects.filter(simulacion=simulacion).order_by('-fecha')[:look_back]
    precios = list(precios)[::-1]  # Invertir el orden para obtener precios cronológicamente
    return [precio.precio for precio in precios]

def predecir_precios_bd(model, scaler, look_back, dias_a_predecir=31, simulacion=None):
    precios = obtener_precios_historicos_bd(simulacion, look_back)
    precios = np.array(precios).reshape(-1, 1)
    precios_escalados = scaler.transform(precios)

    predicciones = []
    input_data = precios_escalados[-look_back:]
    input_data = np.reshape(input_data, (1, look_back, 1))

    for _ in range(dias_a_predecir):
        prediccion = model.predict(input_data)
        predicciones.append(prediccion[0][0])
        input_data = np.concatenate((input_data[:, 1:, :], np.array(prediccion).reshape(1, 1, 1)), axis=1)

    predicciones = scaler.inverse_transform(np.array(predicciones).reshape(-1, 1)).flatten().tolist()

    if simulacion:
        # Corrección: Obtener la última fecha registrada o usar la fecha inicial
        ultima_fecha = PrecioBitcoin.objects.filter(simulacion=simulacion).latest('fecha').fecha
        if ultima_fecha < simulacion.fecha:
            ultima_fecha = simulacion.fecha

        for i, precio in enumerate(predicciones):
            fecha = ultima_fecha + timedelta(days=i+1)
            PrecioBitcoin.objects.create(simulacion=simulacion, fecha=fecha, precio=decimal.Decimal(precio))

    return predicciones