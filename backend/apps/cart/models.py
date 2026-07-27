from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Cart(TimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart"
    )
    coupon = models.ForeignKey(
        "coupons.Coupon", on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name_plural = "carts"

    def __str__(self):
        return f"Cart for {self.user.email}"

    @property
    def subtotal(self):
        return sum(item.line_total for item in self.items.all())

    @property
    def discount(self):
        if self.coupon and self.coupon.is_valid:
            if self.coupon.discount_percent:
                return self.subtotal * self.coupon.discount_percent / 100
            return self.coupon.discount_amount
        return 0

    @property
    def total(self):
        return max(self.subtotal - self.discount, 0)

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        "products.Product", on_delete=models.CASCADE
    )
    variant = models.ForeignKey(
        "products.ProductVariant", on_delete=models.SET_NULL, null=True, blank=True
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ["cart", "product", "variant"]

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"

    @property
    def unit_price(self):
        if self.variant:
            return self.variant.price
        return self.product.price

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    def save(self, *args, **kwargs):
        if self.variant:
            if self.quantity > self.variant.stock:
                self.quantity = self.variant.stock
        else:
            if self.quantity > self.product.stock:
                self.quantity = self.product.stock
        super().save(*args, **kwargs)
