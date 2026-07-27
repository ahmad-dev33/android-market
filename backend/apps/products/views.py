from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductImageSerializer,
)


class IsVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and request.user.vendor_profile.exists()
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.vendor.user == request.user


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True, parent=None)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsVendorOrReadOnly]
    filterset_fields = ["category", "is_featured", "vendor"]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "rating_avg", "sales_count", "created_at"]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related(
            "vendor", "category"
        ).prefetch_related("images")
        category_slug = self.request.query_params.get("category_slug")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        if self.action in ("create", "update", "partial_update"):
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        products = Product.objects.filter(is_active=True, is_featured=True).select_related(
            "vendor", "category"
        ).prefetch_related("images")[:10]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def search(self, request):
        query = request.query_params.get("q", "")
        products = self.get_queryset().filter(name__icontains=query)[:20]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [IsVendorOrReadOnly]

    def get_queryset(self):
        return ProductImage.objects.filter(
            product_id=self.kwargs["product_pk"]
        )

    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs["product_pk"])
