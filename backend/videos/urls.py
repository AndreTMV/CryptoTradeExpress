from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from videos import views

# api versioning

router = routers.DefaultRouter()
router.register(r'videos', views.VideoView, 'videos')
router.register(r'sections', views.SectionView, 'sections')
router.register(r'evideos', views.Eliminated_VideoView, 'evideos')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Video/', include_docs_urls(title="Videos Api")),
    path("api/v1/getSectionVideos/", views.get_section_videos),
    path("api/v1/updateStars/", views.update_stars),
    path("api/v1/starsMedia/", views.media_stars),
    path("api/v1/updateViews/", views.increase_video_views),
    path("api/v1/videoExist/", views.check_video_exists),
    path("api/v1/EliminatedVideoExist/", views.check_video_eliminated_exists),
    path("api/v1/acceptVideo/", views.video_status),
    path("api/v1/noAcceptedVideos/", views.get_videos_no_accepted),
    path("api/v1/declineVideo/", views.video_remove),
]