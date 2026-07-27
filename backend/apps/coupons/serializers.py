from rest_framework import permissions, serializers

from .models import Coupon


class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Coupon
        fields = [
            "id", "code", "description", "discount_percent", "discount_amount",
            "min_order_amount", "max_uses", "used_count",
            "valid_from", "valid_to", "is_active", "is_valid",
        ]
        read_only_fields = ["id", "used_count"]


class ApplyCouponSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
