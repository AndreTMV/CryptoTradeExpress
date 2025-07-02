# simulator/urls.py

from django.urls import path, include
from . import views
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'simulador', views.SimuladorView, 'simulador')
router.register(r'precios', views.PrecioView, 'precios')
router.register(r'transacciones', views.TransaccionView, 'transacciones')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Simulador/', include_docs_urls(title="Simulador Api")),
    path('api/v1/simulacion/', views.obtener_simulacion, name='obtener_simulacion'),
    path('api/v1/transacciones/', views.obtener_transacciones, name='obtener_transacciones'),
    path('api/v1/precios/', views.obtener_precios_bitcoin, name='obtener_precios_bitcoin'),
    path('api/v1/iniciar/', views.iniciar_simulacion, name='iniciar_simulacion'),
    path('api/v1/avanzar/', views.avanzar_simulacion, name='avanzar_simulacion'),
    path('api/v1/comprar/', views.comprar_bitcoin, name='comprar_bitcoin'),
    path('api/v1/vender/', views.vender_bitcoin, name='vender_bitcoin'),
    path('api/v1/reiniciar/', views.reiniciar_simulacion, name='reiniciar_simulacion'),
    path('api/v1/predicciones/', views.predecir_precios_view, name='predecir_precios'),
    path('api/v1/actualizar_fecha/', views.actualizar_ultima_fecha, name='update_date'),
    path('api/v1/more_predictions/', views.actualizar_precios_futuros, name='update_date'),
]
