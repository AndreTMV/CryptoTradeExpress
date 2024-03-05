from django.urls import path,include
from login import views


urlpatterns = [
    path('checkOTP/', views.checkOTP ),
    path('sendOTP/',views.otpGeneration),
    path('isStaff/',views.user_is_staff),
    path('checkUsernameInfo/',views.check_username_exists),
    path('checkEmailInfo/',views.check_email_exists)
]