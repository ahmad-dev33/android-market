from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Review
from .serializers import ReviewCreateSerializer, ReviewSerializer


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def product_reviews(request, product_id):
    reviews = Review.objects.filter(
        product_id=product_id, is_active=True
    ).select_related("user")
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_review(request):
    serializer = ReviewCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product = serializer.validated_data["product"]
    if Review.objects.filter(
        user=request.user, product=product, is_active=True
    ).exists():
        return Response(
            {"detail": "You have already reviewed this product."},
            status=400,
        )
    review = serializer.save()
    return Response(ReviewSerializer(review).data, status=201)


@api_view(["PUT", "DELETE"])
@permission_classes([permissions.IsAuthenticated])
def review_detail(request, review_id):
    try:
        review = Review.objects.get(id=review_id, user=request.user)
    except Review.DoesNotExist:
        return Response({"detail": "Review not found."}, status=404)

    if request.method == "DELETE":
        review.soft_delete()
        return Response(status=204)

    serializer = ReviewCreateSerializer(review, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(ReviewSerializer(review).data)
