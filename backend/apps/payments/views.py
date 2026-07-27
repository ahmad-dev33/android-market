import stripe
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.orders.models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_payment_intent(request):
    order_id = request.data.get("order_id")
    if not order_id:
        return Response({"detail": "order_id is required."}, status=400)

    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found."}, status=404)

    if order.status != "pending":
        return Response(
            {"detail": "Order is not in pending status."}, status=400
        )

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(order.total * 100),
            currency="usd",
            metadata={
                "order_id": order.id,
                "order_number": order.order_number,
                "user_id": request.user.id,
            },
        )
        return Response({
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id,
        })
    except stripe.error.StripeError as e:
        return Response({"detail": str(e)}, status=400)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response(status=400)

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        order_id = intent["metadata"]["order_id"]
        try:
            order = Order.objects.get(id=order_id)
            order.status = "processing"
            from django.utils import timezone
            order.paid_at = timezone.now()
            order.save(update_fields=["status", "paid_at"])
        except Order.DoesNotExist:
            pass

    elif event["type"] == "payment_intent.payment_failed":
        intent = event["data"]["object"]
        order_id = intent["metadata"].get("order_id")
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                order.status = "cancelled"
                order.save(update_fields=["status"])
            except Order.DoesNotExist:
                pass

    return Response(status=200)
