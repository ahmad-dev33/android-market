# Android Market — Multi-Vendor E-Commerce Platform

A professional multi-vendor marketplace app built with **React Native (Expo)** for Android/iOS and **Django REST Framework** for the backend API, with a **React + Vite** admin dashboard.

## Architecture

```
android-market/
├── backend/      # Django REST Framework API
├── mobile/       # React Native Expo app (Android/iOS)
├── admin/        # React + Vite admin dashboard
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | React Native, Expo SDK 52, TypeScript, Expo Router, NativeWind, Zustand, React Query |
| **Backend** | Django 5.x, DRF, SimpleJWT, Celery, Redis, PostgreSQL, drf-spectacular |
| **Admin** | React 18, Vite, TypeScript, Tailwind CSS, Recharts |
| **Payments** | Stripe |
| **Notifications** | Firebase Cloud Messaging |
| **DevOps** | Docker Compose, GitHub Actions CI/CD |

## Features

### Mobile App (Buyer/Vendor)
- JWT Authentication (register, login, logout, password reset)
- Browse products with search, filter by category/price
- Product detail with image gallery, reviews, variant selection
- Shopping cart with quantity management
- Checkout with shipping address
- Stripe payment integration
- Order history and tracking
- Vendor registration and dashboard
- Seller ratings and reviews
- Push notifications (FCM)

### Admin Dashboard
- Dashboard with stats (revenue, orders, products, users)
- Product management with search
- Order management with status filtering
- Vendor management and verification
- Coupon management

### Backend API
- 10 modular Django apps (accounts, products, vendors, cart, orders, payments, reviews, notifications, coupons, core)
- JWT auth with token blacklist
- OpenAPI/Swagger documentation at `/api/docs/`
- PostgreSQL with optimized queries
- Celery async tasks
- Redis caching
- Stripe webhook processing

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for mobile & admin)
- Python 3.12+ (for backend development)

### 1. Clone & Setup

```bash
git clone <repository-url>
cd android-market
cp .env.example .env
```

### 2. Start with Docker

```bash
docker compose up --build
```

This starts:
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **MinIO (S3)**: http://localhost:9001

### 3. Run Mobile App

```bash
cd mobile
npm install
npx expo start
```

Press `a` for Android emulator or scan QR with Expo Go.

### 4. Run Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

Opens at http://localhost:5173

### 5. Create Superuser

```bash
docker compose exec backend python manage.py createsuperuser
```

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /api/v1/auth/register/`, `POST /api/v1/auth/login/`, `POST /api/v1/auth/logout/` |
| Products | `GET /api/v1/products/`, `GET /api/v1/products/featured/`, `GET /api/v1/categories/` |
| Cart | `GET /api/v1/cart/`, `POST /api/v1/cart/items/`, `DELETE /api/v1/cart/items/{id}/remove/` |
| Orders | `POST /api/v1/orders/checkout/`, `GET /api/v1/orders/` |
| Payments | `POST /api/v1/payments/create-intent/`, `POST /api/v1/payments/webhook/` |
| Reviews | `GET /api/v1/products/{id}/reviews/`, `POST /api/v1/reviews/` |
| Vendors | `POST /api/v1/vendor/register/`, `GET /api/v1/vendor/dashboard/` |
| Coupons | `POST /api/v1/coupons/apply/`, `DELETE /api/v1/coupons/remove/` |
| Notifications | `GET /api/v1/notifications/`, `POST /api/v1/notifications/register-device/` |

Full API documentation: http://localhost:8000/api/docs/

## Reference Projects

This project architecture and patterns were inspired by these top GitHub projects:

| # | Project | GitHub | Key Concepts |
|---|---------|--------|--------------|
| 1 | **BTR-Mall** | `MuhammadNouman769/BTR-Mall` | Modular Django apps, B2B+B2C, product variants |
| 2 | **SFE Marketplace** | `mdreuiche/SFE` | React Native + Expo, JWT auth, WebSocket messaging |
| 3 | **ThriftHub** | `israelias/thrifthub` | Monorepo, multi-vendor, Expo + DRF |
| 4 | **VendorHub** | `A-132001/ecommerce-multivendor` | Multi-vendor, Redis caching, Celery, OpenAPI docs |
| 5 | **Halum Hut** | `nohan-ahmed/halum_hut` | Full e-commerce backend, WebSocket notifications |
| 6 | **Landuche Marketplace** | `Landuche/Marketplace` | Stripe, Google Maps, Docker, AWS S3, monitoring |
| 7 | **SandipAcharya E-commerce** | `SandipAcharya/E-commerce` | Zero N+1 queries, dual auth, payment gateway |
| 8 | **Common Ground** | `tahatkn/common-ground-architecture` | Production RN + Django, DB optimization, Sentry |
| 9 | **turbo-boilerplate** | `rissets/turbo-boilerplate` | Turborepo, Expo Router, Celery/Redis, Docker |
| 10 | **MobileVerse** | `Ranshchettri/MobileVerse` | Full-stack e-commerce, reviews, order tracking |

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `SECRET_KEY` — Django secret key
- `DATABASE_URL` — PostgreSQL connection
- `STRIPE_SECRET_KEY` — Stripe API key
- `EXPO_PUBLIC_API_URL` — API URL for mobile app

## License

MIT
