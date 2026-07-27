from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id", "product", "variant", "vendor", "product_name",
            "product_image", "quantity", "unit_price", "total",
        ]


class OrderListSerializer(serializers.ModelSerializer):
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "status", "total", "item_count",
            "created_at", "paid_at",
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "status", "subtotal", "discount",
            "shipping_cost", "tax", "total", "shipping_address",
            "billing_address", "notes", "items",
            "created_at", "paid_at", "shipped_at", "delivered_at",
        ]


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.DictField()
    billing_address = serializers.DictField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_shipping_address(self, value):
        required = ["street", "city", "state", "zip_code", "country"]
        for field in required:
            if field not in value:
                raise serializers.ValidationError(f"'{field}' is required.")
        return value
