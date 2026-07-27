from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.cart.models import Cart

from .models import Coupon
from .serializers import ApplyCouponSerializer, CouponSerializer


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def apply_coupon(request):
    serializer = ApplyCouponSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    code = serializer.validated_data["code"].upper()

    try:
        coupon = Coupon.objects.get(code=code)
    except Coupon.DoesNotExist:
        return Response({"detail": "Invalid coupon code."}, status=404)

    if not coupon.is_valid:
        return Response({"detail": "Coupon is expired or fully used."}, status=400)

    cart, _ = Cart.objects.get_or_create(user=request.user)
    if cart.subtotal < coupon.min_order_amount:
        return Response(
            {
                "detail": f"Minimum order amount is ${coupon.min_order_amount}.",
            },
            status=400,
        )

    cart.coupon = coupon
    cart.save(update_fields=["coupon"])

    return Response(
        {
            "detail": "Coupon applied.",
            "discount": str(coupon.apply(cart.subtotal)),
            "coupon": CouponSerializer(coupon).data,
        }
    )


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def remove_coupon(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart.coupon = None
    cart.save(update_fields=["coupon"])
    return Response({"detail": "Coupon removed."})
