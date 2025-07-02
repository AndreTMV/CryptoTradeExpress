from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from cartera import views

urlpatterns = [
    path('docs/Cartera/', include_docs_urls(title="Cartera Api")),
    path("api/v1/getUserInfo/", views.get_binance_info),
]