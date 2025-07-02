from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from compras import views

router = routers.DefaultRouter()
router.register(r'compras', views.CompraView, 'compras')
router.register(r'venta', views.VentaView, 'venta')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Compras/', include_docs_urls(title="Compras Api")),
    path("api/v1/data_transacciones/", views.datos_transacciones),
    path("api/v1/grafica_opcion_1/", views.datos_transacciones_grafica1),
    path("api/v1/transacciones_month/", views.ganancias_por_mes),
    path("api/v1/getPairs/", views.get_pairs),
    path("api/v1/buySell/", views.comprar_vender),
    path("api/v1/getSales/", views.obtener_ventas),
    path("api/v1/getPurchases/", views.obtener_compras),
]