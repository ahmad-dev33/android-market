from rest_framework import permissions, serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id", "type", "title", "message", "data",
            "is_read", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RegisterDeviceSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=500)
    platform = serializers.CharField(max_length=20, default="android")
