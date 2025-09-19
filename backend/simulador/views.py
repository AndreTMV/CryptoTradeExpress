import decimal
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from datetime import datetime, timedelta
import requests
from login.models import User

# Models and serializers
from .models import PrecioBitcoin, Simulacion, Transaccion
from .serializers import SimulacionSerializer, TransaccionSerializer, PrecioBitcoinSerializer
from .ml_model import *


class SimuladorView(viewsets.ModelViewSet):
    serializer_class = SimulacionSerializer
    queryset = Simulacion.objects.all()


class TransaccionView(viewsets.ModelViewSet):
    serializer_class = TransaccionSerializer
    queryset = Transaccion.objects.all()


class PrecioView(viewsets.ModelViewSet):
    serializer_class = PrecioBitcoinSerializer
    queryset = PrecioBitcoin.objects.all()


def obtener_precios_ultimos_31_dias():
    url = "https://api.binance.com/api/v3/klines"
    params = {
        'symbol': 'BTCUSDT',
        'interval': '1d',
        'limit': 31
    }
    response = requests.get(url, params=params)
    data = response.json()
    precios = []
    for entry in data:
        fecha = datetime.fromtimestamp(entry[0] / 1000).date()
        precio = float(entry[4])
        precios.append({'fecha': fecha, 'precio': precio})
    return precios


def guardar_precios_historicos(simulacion):
    precios = obtener_precios_ultimos_31_dias()
    for precio in precios:
        PrecioBitcoin.objects.create(
            simulacion=simulacion, fecha=precio['fecha'], precio=precio['precio'])


@api_view(['POST'])
def iniciar_simulacion(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            Simulacion.objects.filter(user=user).delete()
            simulacion = Simulacion.objects.create(user=user)
            guardar_precios_historicos(simulacion)
            model, scaler, look_back = entrenar_modelo_lstm()
            predecir_precios(model, scaler, look_back, simulacion=simulacion)
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)


@api_view(['POST'])
def reiniciar_simulacion(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            Simulacion.objects.filter(user=user).delete()
            simulacion = Simulacion.objects.create(user=user)
            guardar_precios_historicos(simulacion)
            model, scaler, look_back = entrenar_modelo_lstm()
            predecir_precios(model, scaler, look_back, simulacion=simulacion)
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)


@api_view(['GET'])
def obtener_simulacion(request):
    user_id = request.query_params.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            simulacion = Simulacion.objects.get(user=user)
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, status=200)
        except Simulacion.DoesNotExist:
            return Response({'error': 'Simulación no encontrada'}, status=404)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)


@api_view(['GET'])
def obtener_transacciones(request):
    user_id = request.query_params.get('user')
    if not user_id:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)

    try:
        user = User.objects.get(id=user_id)
        simulacion = Simulacion.objects.get(user=user)
        transacciones = Transaccion.objects.filter(
            simulacion=simulacion).order_by('fecha')
        serializer = TransaccionSerializer(transacciones, many=True)
        return Response(serializer.data, status=200)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)
    except Simulacion.DoesNotExist:
        return Response({'error': 'Simulación no encontrada'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def obtener_precios_bitcoin(request):
    user_id = request.query_params.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            simulacion = Simulacion.objects.get(user=user)
            precios = PrecioBitcoin.objects.filter(
                simulacion=simulacion).order_by('fecha')
            serializer = PrecioBitcoinSerializer(precios, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def avanzar_simulacion(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            simulacion = Simulacion.objects.get(user=user)
            nueva_fecha = simulacion.fecha + timedelta(days=31)
            precios_disponibles = PrecioBitcoin.objects.filter(
                simulacion=simulacion, fecha__gte=simulacion.fecha, fecha__lte=nueva_fecha).count()

            if precios_disponibles < 31:
                dias_a_predecir = 31 - precios_disponibles
                model, scaler, look_back = entrenar_modelo_lstm()
                predecir_precios(
                    model, scaler, look_back, dias_a_predecir=dias_a_predecir, simulacion=simulacion)

            simulacion.fecha = nueva_fecha
            simulacion.save()
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, status=200)
        except Simulacion.DoesNotExist:
            return Response({'error': 'Simulación no encontrada'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)


@api_view(['POST'])
def comprar_bitcoin(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            cantidad = decimal.Decimal(request.data.get('cantidad'))
            simulacion = Simulacion.objects.get(user=user)
            fecha = request.data.get('fecha')
            fecha_inicial = datetime.strptime(fecha, '%Y-%m-%d').date()
            precio_actual = PrecioBitcoin.objects.get(
                simulacion=simulacion, fecha=fecha_inicial)
            precio = precio_actual.precio
            if simulacion.balance >= cantidad * precio:
                simulacion.balance -= cantidad * precio
                simulacion.bitcoins += cantidad
                simulacion.fecha = fecha_inicial
                simulacion.save()
                Transaccion.objects.create(
                    simulacion=simulacion, tipo='compra', cantidad=cantidad, precio=precio)
            else:
                return Response({'error': 'Balance insuficiente'}, status=400)
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, status=200)
        except Simulacion.DoesNotExist:
            return Response({'error': 'Simulación no encontrada'}, status=404)
        except PrecioBitcoin.DoesNotExist:
            return Response({'error': 'Precio no encontrado para la fecha especificada'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)


@api_view(['POST'])
def vender_bitcoin(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            cantidad = decimal.Decimal(request.data.get('cantidad'))
            simulacion = Simulacion.objects.get(user=user)
            fecha = request.data.get('fecha')
            fecha_inicial = datetime.strptime(fecha, '%Y-%m-%d').date()
            precio_actual = PrecioBitcoin.objects.get(
                simulacion=simulacion, fecha=fecha_inicial)
            precio = precio_actual.precio
            if simulacion.bitcoins >= cantidad:
                simulacion.balance += cantidad * precio
                simulacion.bitcoins -= cantidad
                simulacion.fecha = fecha_inicial
                simulacion.save()
                Transaccion.objects.create(
                    simulacion=simulacion, tipo='venta', cantidad=cantidad, precio=precio)
            else:
                return Response({'error': 'Cantidad de bitcoins insuficiente'}, status=400)
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, status=200)
        except Simulacion.DoesNotExist:
            return Response({'error': 'Simulación no encontrada'}, status=404)
        except PrecioBitcoin.DoesNotExist:
            return Response({'error': 'Precio no encontrado para la fecha especificada'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)


@api_view(['GET'])
def predecir_precios_view(request):
    try:
        model, scaler, look_back = entrenar_modelo_lstm()
        predicciones = predecir_precios(model, scaler, look_back)
        return Response(predicciones, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['PUT'])
def actualizar_ultima_fecha(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            simulacion = Simulacion.objects.get(user=user)
            fecha = request.data.get('fecha')
            fecha_inicial = datetime.strptime(fecha, '%Y-%m-%d').date()
            simulacion.fecha = fecha_inicial
            simulacion.save()
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, status=200)
        except Simulacion.DoesNotExist:
            return Response({'error': 'Simulación no encontrada'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)


@api_view(['POST'])
def actualizar_precios_futuros(request):
    user_id = request.data.get('user')
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        try:
            simulacion = Simulacion.objects.get(user=user)
            model, scaler, look_back = entrenar_modelo_lstm()
            predicciones = predecir_precios_bd(
                model, scaler, look_back, simulacion=simulacion)
            fecha = request.data.get('fecha')
            fecha_inicial = datetime.strptime(fecha, '%Y-%m-%d').date()
            solo_fecha_str = fecha_inicial.strftime('%d de %m de %Y')
            print(solo_fecha_str)

            simulacion.fecha = fecha_inicial
            simulacion.save()
            serializer = SimulacionSerializer(simulacion)
            return Response(serializer.data, 201)
        except Simulacion.DoesNotExist:
            return Response({'error': 'Simulación no encontrada'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario'}, status=404)
