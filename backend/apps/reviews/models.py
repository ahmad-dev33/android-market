from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.core.models import TimeStampedModel, SoftDeleteModel


class Review(TimeStampedModel, SoftDeleteModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews"
    )
    product = models.ForeignKey(
        "products.Product", on_delete=models.CASCADE, related_name="reviews"
    )
    vendor = models.ForeignKey(
        "vendors.Vendor", on_delete=models.CASCADE, related_name="reviews",
        null=True, blank=True,
    )
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ["user", "product"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}*)"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.recalculate_rating()
