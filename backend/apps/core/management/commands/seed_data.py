import uuid
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.vendors.models import Vendor
from apps.products.models import Category, Product
from apps.coupons.models import Coupon
from apps.orders.models import Order, OrderItem
from apps.reviews.models import Review

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with essential dummy data"

    def handle(self, *args, **options):
        self.stdout.write("Clearing existing data...")
        Review.objects.all().delete()
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Vendor.objects.all().delete()
        User.objects.all().delete()
        Coupon.objects.all().delete()

        self.stdout.write("Creating users...")
        admin_user = User.objects.create_superuser(
            username="admin", email="admin@market.com", password="adminpassword123",
            role=User.Role.ADMIN, is_verified=True
        )
        vendor_user = User.objects.create_user(
            username="vendor", email="vendor@market.com", password="vendorpassword123",
            role=User.Role.VENDOR, is_verified=True
        )
        customer_user = User.objects.create_user(
            username="customer", email="customer@market.com", password="customerpassword123",
            role=User.Role.BUYER, is_verified=True
        )

        self.stdout.write("Creating vendor profile...")
        vendor_profile = Vendor.objects.create(
            user=vendor_user, store_name="Tech Planet", slug="tech-planet",
            description="Your premium destination for the latest gadgets.",
            phone="+123456789", email="techplanet@market.com", is_active=True, is_verified=True
        )

        self.stdout.write("Creating categories...")
        electronics = Category.objects.create(
            name="Electronics", slug="electronics", icon="laptop-outline", sort_order=1
        )
        fashion = Category.objects.create(
            name="Fashion", slug="fashion", icon="shirt-outline", sort_order=2
        )
        home = Category.objects.create(
            name="Home & Living", slug="home-living", icon="home-outline", sort_order=3
        )

        self.stdout.write("Creating products...")
        p1 = Product.objects.create(
            vendor=vendor_profile, category=electronics, name="Pro Wireless Headphones",
            slug="pro-wireless-headphones", description="Active noise cancellation, 40 hours battery.",
            price=129.99, compare_at_price=159.99, stock=45, sku="HW-ANC-40",
            is_featured=True, rating_avg=4.8, rating_count=1
        )
        p2 = Product.objects.create(
            vendor=vendor_profile, category=electronics, name="Vantage Sports Smartwatch",
            slug="vantage-sports-smartwatch", description="Track workouts, sleep, and health metrics.",
            price=199.99, stock=25, sku="SW-VANT-01", is_featured=True, rating_avg=4.5, rating_count=1
        )
        p3 = Product.objects.create(
            vendor=vendor_profile, category=fashion, name="Classic Denim Jacket",
            slug="classic-denim-jacket", description="Timeless vintage-style denim jacket.",
            price=59.99, compare_at_price=79.99, stock=15, sku="FJ-DENIM-VNTG", is_featured=False
        )

        self.stdout.write("Creating coupons & reviews...")
        Coupon.objects.create(
            code="WELCOME10", description="10% discount on orders",
            discount_percent=10.00, min_order_amount=50.00, max_uses=100,
            valid_from=timezone.now() - timezone.timedelta(days=1),
            valid_to=timezone.now() + timezone.timedelta(days=365), is_active=True
        )
        Review.objects.create(
            user=customer_user, product=p1, rating=5, title="Exceptional ANC!",
            comment="The active noise cancelling is absolutely top tier."
        )

        self.stdout.write("Database seeded successfully with local demo data!")
        self.stdout.write("Super Admin: admin@market.com / adminpassword123")
        self.stdout.write("Vendor:      vendor@market.com / vendorpassword123")
        self.stdout.write("Customer:    customer@market.com / customerpassword123")
