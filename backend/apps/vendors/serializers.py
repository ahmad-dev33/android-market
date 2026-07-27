from rest_framework import permissions, serializers

from .models import Vendor


class VendorSerializer(serializers.ModelSerializer):
    total_products = serializers.IntegerField(read_only=True)

    class Meta:
        model = Vendor
        fields = [
            "id", "store_name", "slug", "description", "logo", "banner",
            "phone", "email", "address", "rating_avg", "total_sales",
            "is_active", "is_verified", "total_products", "created_at",
        ]
        read_only_fields = ["id", "rating_avg", "total_sales", "is_verified", "created_at"]


class VendorRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ["store_name", "slug", "description", "logo", "banner", "phone", "email", "address"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        vendor = Vendor.objects.create(**validated_data)
        vendor.user.role = "vendor"
        vendor.user.save(update_fields=["role"])
        return vendor


class VendorDashboardSerializer(serializers.ModelSerializer):
    total_products = serializers.IntegerField(read_only=True)

    class Meta:
        model = Vendor
        fields = [
            "id", "store_name", "rating_avg", "total_sales",
            "total_products", "is_active", "is_verified",
        ]
