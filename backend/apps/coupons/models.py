from django.db import models
from django.utils import timezone

from apps.core.models import TimeStampedModel


class Coupon(TimeStampedModel):
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    discount_percent = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    min_order_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    max_uses = models.PositiveIntegerField(default=0, help_text="0 = unlimited")
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.code

    @property
    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from or now > self.valid_to:
            return False
        if self.max_uses > 0 and self.used_count >= self.max_uses:
            return False
        return True

    def apply(self, subtotal):
        if not self.is_valid:
            return 0
        if subtotal < self.min_order_amount:
            return 0
        if self.discount_percent:
            return subtotal * self.discount_percent / 100
        if self.discount_amount:
            return min(self.discount_amount, subtotal)
        return 0

    def use(self):
        self.used_count += 1
        self.save(update_fields=["used_count"])
