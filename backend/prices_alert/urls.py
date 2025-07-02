from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from prices_alert import views

router = routers.DefaultRouter()
router.register(r'prices', views.PriceAlertView, 'prices')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Price/', include_docs_urls(title="Price Api")),
]