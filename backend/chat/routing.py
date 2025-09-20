from django.urls import re_path
from .consumers import DMConsumer

websocket_urlpatterns = [
    # DM con el usuario <peer_id>
    re_path(r"^ws/chat/dm/(?P<peer_id>\d+)/$", DMConsumer.as_asgi()),
]

