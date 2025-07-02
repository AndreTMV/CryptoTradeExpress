from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from noticias import views

# api versioning

router = routers.DefaultRouter()
router.register(r'noticias', views.NoticiaView, 'noticias')
router.register(r'cryptos', views.CryptoView, 'trending_cryptos')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Noticia/', include_docs_urls(title="Noticia Api")),
    path('api/v1/getCryptos/', views.get_trending_cryptos),
    path('api/v1/getNews/', views.get_news),
    path('api/v1/getTrendingNews/', views.get_trending_news),
]