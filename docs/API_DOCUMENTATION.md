# MERKATO ሱፐርማርኬት — REST API Documentation

Welcome to the **MERKATO API** specification. This document outlines the available endpoints, query parameters, request bodies, authentication requirements, and error codes.

---

## 🌐 Base URL
```
Production: https://merkato-backend.onrender.com/api
Development: http://localhost:5000/api
```

---

## 🔐 Authentication
Protected endpoints require a JSON Web Token (JWT) provided in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 📦 Endpoints Summary

### 1. Products API (`/products`)
- `GET /products` — List all products (supports query params: `category`, `aisle`, `minPrice`, `maxPrice`, `search`, `page`, `limit`)
- `GET /products/:id` — Retrieve a single product by ID or slug
- `POST /products` — Create a new product (Admin only)
- `PUT /products/:id` — Update an existing product (Admin only)
- `DELETE /products/:id` — Delete a product (Admin only)

### 2. Authentication API (`/auth`)
- `POST /auth/register` — Register a new customer account
- `POST /auth/login` — Sign in and obtain JWT token
- `GET /auth/profile` — Get authenticated user details
- `PUT /auth/profile` — Update user profile

### 3. Orders API (`/orders`)
- `GET /orders` — List orders for authenticated user
- `POST /orders` — Place a new order with items, shipping zone, and payment method
- `GET /orders/:id` — Get specific order details & timeline
- `PUT /orders/:id/status` — Update order fulfillment status (Admin only)

### 4. Payments API
- `POST /telebirr/create-payment` — Initiate a Telebirr payment transaction
- `POST /telebirr/webhook` — Telebirr payment confirmation webhook
- `POST /cbe/verify-transaction` — Verify CBE Birr transaction reference

### 5. Discounts & Coupons (`/coupons`)
- `POST /coupons/validate` — Validate voucher code and compute discount amount

### 6. Artisans API (`/artisans`)
- `GET /artisans` — List featured artisans with regional filters
- `POST /artisans/apply` — Submit application to join the artisan co-op

---

## 🏷️ Standard Status & Error Codes
- `200 OK` — Successful operation
- `201 Created` — Resource created
- `400 Bad Request` — Validation failure
- `401 Unauthorized` — Missing or invalid token
- `403 Forbidden` — Insufficient privileges (e.g. non-admin)
- `404 Not Found` — Resource not found
- `429 Too Many Requests` — Rate limit exceeded
- `500 Internal Server Error` — Server exception
