from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

import ccxt
import pandas as pd
import numpy as np

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from datetime import timedelta

EXCHANGE = ccxt.binance({
    'enableRateLimit': True,
})


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


@api_view(['GET'])
def get_cryptos(request):
    """
    Regresa el listado de cryptos (prefiltradas a las que tienen par /USDT).
    GET /api/cryptos
    """
    try:
        EXCHANGE.load_markets()
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

        if len(df) < 3:
            return Response({'error': 'No hay suficientes datos para la regresión.'},
                            status=status.HTTP_400_BAD_REQUEST)

        y = df['close'].values[1:].reshape(-1, 1)  # (N-1, 1)
        X_days = np.arange(1, len(df)).reshape(-1, 1)  # 1..N-1

        model = LinearRegression().fit(X_days, y)

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
