from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from perfil import views

# api versioning

router = routers.DefaultRouter()
router.register(r'perfil', views.PerfilView, 'perfil')
router.register(r'recomendations', views.ExcludedRecomendationsView, 'recomendations')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Perfil/', include_docs_urls(title="Perfil Api")),
    path('api/v1/perfilExist/', views.perfil_exist),
    path('api/v1/perfilInfo/', views.perfil_info),
    path('api/v1/hideInformation/', views.update_hidden_information),
    path('api/v1/publicInformation/', views.get_public_info),
    path('api/v1/cosineSimilarity/', views.cosine_similarity_view),
    path('api/v1/excludeUser/', views.add_user_recomendations),
    path('api/v1/excludeUserList/', views.get_excluded_users),
]