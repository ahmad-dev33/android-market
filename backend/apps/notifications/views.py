from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import DeviceToken, Notification
from .serializers import NotificationSerializer, RegisterDeviceSerializer


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def register_device(request):
    serializer = RegisterDeviceSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    DeviceToken.objects.update_or_create(
        user=request.user,
        token=serializer.validated_data["token"],
        defaults={"platform": serializer.validated_data["platform"]},
    )
    return Response({"detail": "Device registered."})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def notification_list(request):
    notifications = Notification.objects.filter(user=request.user)
    is_read = request.query_params.get("is_read")
    if is_read is not None:
        notifications = notifications.filter(is_read=is_read.lower() == "true")
    serializer = NotificationSerializer(notifications[:50], many=True)
    return Response(serializer.data)


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def mark_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
    except Notification.DoesNotExist:
        return Response({"detail": "Not found."}, status=404)
    notification.mark_as_read()
    return Response(NotificationSerializer(notification).data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"detail": "All notifications marked as read."})
