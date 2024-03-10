from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from perfil import views

# api versioning

router = routers.DefaultRouter()
router.register(r'perfil', views.PerfilView, 'perfil')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Perfil/', include_docs_urls(title="Perfil Api")),
]