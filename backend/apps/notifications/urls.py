from django.urls import path

from . import views

urlpatterns = [
    path("register-device/", views.register_device, name="register-device"),
    path("", views.notification_list, name="notification-list"),
    path("<int:notification_id>/read/", views.mark_as_read, name="mark-as-read"),
    path("read-all/", views.mark_all_read, name="mark-all-read"),
]
