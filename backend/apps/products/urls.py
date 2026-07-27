from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("categories", views.CategoryViewSet, basename="category")
router.register("products", views.ProductViewSet, basename="product")

urlpatterns = [
    path(
        "products/<int:product_pk>/images/",
        views.ProductImageViewSet.as_view({"get": "list", "post": "create"}),
        name="product-images",
    ),
    path(
        "products/<int:product_pk>/images/<int:pk>/",
        views.ProductImageViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="product-image-detail",
    ),
    path("", include(router.urls)),
]
