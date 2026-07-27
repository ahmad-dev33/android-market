from django.db import transaction
from django.db.models import Sum
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.cart.models import Cart
from apps.products.models import Product, ProductVariant

from .models import Order, OrderItem
from .serializers import (
    CheckoutSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    serializer = CheckoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    try:
        cart = Cart.objects.select_related("coupon").prefetch_related(
            "items__product", "items__variant"
        ).get(user=request.user)
    except Cart.DoesNotExist:
        return Response({"detail": "Cart is empty."}, status=400)

    cart_items = cart.items.all()
    if not cart_items.exists():
        return Response({"detail": "Cart is empty."}, status=400)

    with transaction.atomic():
        order = Order.objects.create(
            user=request.user,
            subtotal=cart.subtotal,
            discount=cart.discount,
            total=cart.total,
            shipping_address=data["shipping_address"],
            billing_address=data.get("billing_address", data["shipping_address"]),
            notes=data.get("notes", ""),
        )

        for item in cart_items:
            product = item.product
            variant = item.variant

            if variant:
                stock = variant.stock
                if stock < item.quantity:
                    transaction.set_rollback(True)
                    return Response(
                        {"detail": f"'{product.name}' ({variant.name}) has only {stock} in stock."},
                        status=400,
                    )
                variant.stock -= item.quantity
                variant.save(update_fields=["stock"])
            else:
                stock = product.stock
                if stock < item.quantity:
                    transaction.set_rollback(True)
                    return Response(
                        {"detail": f"'{product.name}' has only {stock} in stock."},
                        status=400,
                    )
                product.stock -= item.quantity
                product.save(update_fields=["stock"])

            unit_price = item.unit_price
            OrderItem.objects.create(
                order=order,
                product=product,
                variant=variant,
                vendor=product.vendor,
                product_name=product.name,
                product_image=product.images.filter(is_primary=True).first().image.url
                if product.images.filter(is_primary=True).exists()
                else "",
                quantity=item.quantity,
                unit_price=unit_price,
                total=item.line_total,
            )

            Product.objects.filter(pk=product.pk).update(
                sales_count=product.sales_count + item.quantity
            )

        cart.items.all().delete()
        cart.coupon = None
        cart.save()

    return Response(OrderDetailSerializer(order).data, status=201)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def order_list(request):
    orders = Order.objects.filter(user=request.user)
    status_filter = request.query_params.get("status")
    if status_filter:
        orders = orders.filter(status=status_filter)
    serializer = OrderListSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def order_detail(request, order_id):
    try:
        order = Order.objects.prefetch_related("items").get(
            id=order_id, user=request.user
        )
    except Order.DoesNotExist:
        return Response({"detail": "Order not found."}, status=404)
    return Response(OrderDetailSerializer(order).data)


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found."}, status=404)

    vendor = request.user.vendor_profile.first()
    if not vendor or not order.items.filter(vendor=vendor).exists():
        return Response({"detail": "Not authorized."}, status=403)

    new_status = request.data.get("status")
    valid_transitions = {
        "pending": ["processing", "cancelled"],
        "processing": ["shipped", "cancelled"],
        "shipped": ["delivered"],
        "delivered": ["refunded"],
    }
    allowed = valid_transitions.get(order.status, [])
    if new_status not in allowed:
        return Response(
            {"detail": f"Cannot transition from '{order.status}' to '{new_status}'."},
            status=400,
        )
    order.status = new_status
    order.save(update_fields=["status"])
    return Response(OrderDetailSerializer(order).data)
