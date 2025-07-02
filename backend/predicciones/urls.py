from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from predicciones import views

urlpatterns = [
    path('docs/Predicciones/', include_docs_urls(title="Predicciones Api")),
    path("api/v1/getCryptos/", views.get_cryptos),
    path("api/v1/sendGraphData/", views.send_graph_data),
    path("api/v1/sendGraphDataLast/", views.send_graph_data_last),
]