from rest_framework import serializers

from .models import Category, Product, ProductImage, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "description", "image", "icon",
            "parent", "sort_order", "children", "product_count",
        ]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True).data

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "sort_order", "is_primary"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "name", "price", "stock", "sku", "attributes", "is_in_stock"]
        read_only_fields = ["is_in_stock"]


class ProductListSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source="vendor.store_name", read_only=True)
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "price", "compare_at_price",
            "rating_avg", "rating_count", "sales_count", "is_in_stock",
            "vendor", "vendor_name", "category", "category_name",
            "primary_image", "created_at",
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            return ProductImageSerializer(img).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    vendor_name = serializers.CharField(source="vendor.store_name", read_only=True)
    vendor_id = serializers.IntegerField(source="vendor.id", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description", "price", "compare_at_price",
            "stock", "sku", "is_featured", "is_in_stock",
            "rating_avg", "rating_count", "sales_count",
            "vendor", "vendor_name", "vendor_id",
            "category", "category_name",
            "images", "variants", "created_at", "updated_at",
        ]


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "name", "description", "price", "compare_at_price",
            "stock", "sku", "category", "is_featured", "weight",
            "images",
        ]

    def create(self, validated_data):
        validated_data["vendor"] = self.context["request"].user.vendor_profile.first()
        return super().create(validated_data)
