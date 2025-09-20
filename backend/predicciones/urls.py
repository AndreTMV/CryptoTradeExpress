from django.urls import path
from .views import get_cryptos, send_series_last, send_close_regression
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('docs/Predicciones/', include_docs_urls(title="Predicciones API")),
    path('api/v1/cryptos', get_cryptos),
    path('api/v1/series/last', send_series_last),
    path('api/v1/series/regression', send_close_regression),
]

