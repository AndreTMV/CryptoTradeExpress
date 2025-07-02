from django.urls import path,include
from amigos import views


urlpatterns = [
    path('api/v1/friend_request/', views.send_friend_request, name='friend-request'),
    path('api/v1/see_friend_requests/', views.fetch_friend_requests, name='see-friend-requests'),
    path('api/v1/accept_friend_request/', views.accept_friend_request, name='accept-friend-request'),
    path('api/v1/unfriend/', views.remove_friend, name='unfriend'),
    path('api/v1/decline_friend_request/', views.decline_friend_request, name='decline-friend-request'),
    path('api/v1/cancel_friend_request/', views.cancel_friend_request, name='cancel-friend-request'),
    path('api/v1/see_friends/', views.fetch_friends, name='see-friends'),
    path('api/v1/are_friends/', views.are_friends, name='are-friends'),
    path('api/v1/friend_request_exists/', views.friend_request_exists, name='friend-request-status'),
]
