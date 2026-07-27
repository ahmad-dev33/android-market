from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Vendor
from .serializers import VendorSerializer, VendorRegisterSerializer, VendorDashboardSerializer


class IsVendorOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        return Vendor.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == "register":
            return VendorRegisterSerializer
        if self.action == "dashboard":
            return VendorDashboardSerializer
        return VendorSerializer

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def dashboard(self, request):
        vendor = request.user.vendor_profile.first()
        if not vendor:
            return Response(
                {"detail": "You are not a registered vendor."},
                status=403,
            )
        from apps.orders.models import OrderItem
        from django.db.models import Sum, Count

        stats = OrderItem.objects.filter(
            vendor=vendor, order__status__in=["processing", "shipped", "delivered"]
        ).aggregate(
            total_revenue=Sum("total"),
            total_orders=Count("order", distinct=True),
        )
        return Response(
            VendorDashboardSerializer(vendor).data
            | {
                "total_revenue": stats["total_revenue"] or 0,
                "total_orders": stats["total_orders"] or 0,
            }
        )
