from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import User, OTPVerification
class OTPVerifiactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'otp', 'is_verified')

# Register your models here.
class UserAdmin(BaseUserAdmin):
    ordering = ["username"]
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ["id","email", "username", "is_staff", "is_active"]
    list_display_links = ["email"]
    list_filter = ["email", "username", "is_staff", "is_active"]
    search_fields = ["email", "username"]
    fieldsets = (
        (
            _("Login Credentials"), {
                "fields": ("username", "password",)
            }, 
        ),
        (
            _("Personal Information"),
            {
                "fields": ('email',)
            },
        ),
        (
            _("Permissions and Groups"),
            {
                "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")
            },
        ),
        (
            _("Important Dates"),
            {
                "fields": ("last_login",)
            },
        ),
    )
    add_fieldsets = (
            (None, {
                "classes": ("wide",),
                "fields": ("username","email", "password1", "password2", "is_staff", "is_active"),
            },),
        )
admin.site.register(User, UserAdmin)
admin.site.register(OTPVerification, OTPVerifiactionAdmin)