from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.products.models import Product, ProductVariant

from .models import Cart, CartItem
from .serializers import (
    AddToCartSerializer,
    CartItemSerializer,
    CartSerializer,
    UpdateCartItemSerializer,
)


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_cart(request):
    cart = get_or_create_cart(request.user)
    return Response(CartSerializer(cart).data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    serializer = AddToCartSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    try:
        product = Product.objects.get(id=data["product_id"], is_active=True)
    except Product.DoesNotExist:
        return Response({"detail": "Product not found."}, status=404)

    variant = None
    if data.get("variant_id"):
        try:
            variant = ProductVariant.objects.get(id=data["variant_id"], product=product)
        except ProductVariant.DoesNotExist:
            return Response({"detail": "Variant not found."}, status=404)

    cart = get_or_create_cart(request.user)
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart, product=product, variant=variant,
    )

    if not created:
        cart_item.quantity += data["quantity"]
    else:
        cart_item.quantity = data["quantity"]

    max_stock = variant.stock if variant else product.stock
    if cart_item.quantity > max_stock:
        return Response(
            {"detail": f"Only {max_stock} items available in stock."},
            status=400,
        )

    cart_item.save()
    return Response(CartItemSerializer(cart_item).data, status=201)


@api_view(["PUT"])
@permission_classes([permissions.IsAuthenticated])
def update_cart_item(request, item_id):
    cart = get_or_create_cart(request.user)
    try:
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response({"detail": "Cart item not found."}, status=404)

    serializer = UpdateCartItemSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    cart_item.quantity = serializer.validated_data["quantity"]
    cart_item.save()
    return Response(CartItemSerializer(cart_item).data)


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def remove_from_cart(request, item_id):
    cart = get_or_create_cart(request.user)
    try:
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        cart_item.delete()
        return Response(status=204)
    except CartItem.DoesNotExist:
        return Response({"detail": "Cart item not found."}, status=404)


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    cart = get_or_create_cart(request.user)
    cart.items.all().delete()
    cart.coupon = None
    cart.save()
    return Response(status=204)
