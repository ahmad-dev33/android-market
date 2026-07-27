from rest_framework import permissions, serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    user_avatar = serializers.ImageField(source="user.avatar", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id", "user", "user_name", "user_avatar",
            "product", "vendor", "rating", "title", "comment",
            "is_active", "created_at",
        ]
        read_only_fields = ["id", "user", "vendor", "is_active", "created_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        from apps.products.models import Product
        product = validated_data["product"]
        validated_data["vendor"] = product.vendor
        return super().create(validated_data)


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["product", "rating", "title", "comment"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        product = validated_data["product"]
        validated_data["vendor"] = product.vendor
        return super().create(validated_data)
