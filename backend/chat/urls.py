from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers

# api versioning

router = routers.DefaultRouter()
router.register(r'chat', views.ChatMessageView, 'chat')

urlpatterns = [
   path("api/v1/", include(router.urls)),
    path('docs/Chat/', include_docs_urls(title="Chat Api")),
    path("my-message/<user_id>/",views.MyInbox.as_view()),
    path("get-message/<sender_id>/<receiver_id>/",views.GetMessages.as_view()),
    path("send-message/",views.SendMessage.as_view()),
    path("search/<username>/",views.SearchUser.as_view()),
    path("<str:room_name>/", views.room, name="room"),
    path("", views.index, name="index"),
]