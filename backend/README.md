# M² Cakery Backend API

Node.js + Express + MongoDB backend for M² Cakery.

Provides the REST API for the **Admin CMS** and the **public customer storefront**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js >= 18 |
| Framework | Express.js v4 |
| Database | MongoDB Atlas + Mongoose v8 |
| Image Storage | Cloudinary SDK v2 + Multer (memory) |
| Authentication | JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`) |
| Security | `helmet`, `cors`, `dotenv` |
| Logging | `morgan` |
| Dev | `nodemon` |

---

## Setup

```bash
cp .env.example .env   # configure all required variables
npm install
npm run dev            # development (http://localhost:5001)
```

### Create Admin Account

```bash
npm run seed:admin <email> <strong-password>
```

Or via environment variables (recommended in CI/CD):
```bash
ADMIN_EMAIL=owner@m2cakery.com ADMIN_PASSWORD=YourStrongPassword! npm run seed:admin
```

> Safely creates a new admin or rotates the password for an existing one. Never exposes credentials in logs.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start with nodemon hot-reload |
| `npm start` | Start in production mode |
| `npm test` | Run API integration tests |
| `npm run seed:admin` | Create or rotate admin credentials |

---

## Directory Structure

```
backend/
├── scripts/
│   └── createAdmin.js           # CLI: create or rotate admin account
├── src/
│   ├── config/
│   │   ├── db.js                # MongoDB Atlas connection & lifecycle
│   │   └── cloudinary.js        # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── authController.js    # Admin login & profile
│   │   ├── productController.js # Product CRUD & query handlers
│   │   └── healthController.js  # Service health check
│   ├── middleware/
│   │   ├── auth.js              # JWT requireAuth & optionalAuth
│   │   ├── errorHandler.js      # Centralized error handler (no credential leakage)
│   │   ├── notFound.js          # 404 handler
│   │   └── validation.js        # Request body & ObjectId validators
│   ├── models/
│   │   ├── Admin.js             # Admin schema (bcrypt, JWT-safe toJSON)
│   │   └── Product.js           # Product schema (categories, pricing, images, archival)
│   ├── routes/
│   │   ├── auth.js              # /api/auth
│   │   ├── products.js          # /api/products
│   │   ├── health.js            # /api/health
│   │   └── index.js             # Root router
│   ├── services/
│   │   └── cloudinaryService.js # Upload, delete, error diagnostics
│   ├── app.js                   # Express app setup (helmet, CORS, body parsing)
│   └── server.js                # Startup, graceful shutdown (SIGINT/SIGTERM)
├── .env.example                 # Environment variable template
├── .gitignore
└── package.json
```

---

## API Reference

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Verify API status and environment |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Authenticate admin → returns JWT |
| `GET` | `/api/auth/me` | Bearer Token | Current admin profile |

**Login request:**
```json
POST /api/auth/login
{ "email": "owner@m2cakery.com", "password": "YourPassword" }
```

**Login response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "admin": { "id": "...", "email": "owner@m2cakery.com", "role": "admin" }
  }
}
```

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | Optional | List published products (filter, paginate, sort) |
| `GET` | `/api/products/:id` | Optional | Single published product |
| `POST` | `/api/products/upload-image` | **Admin** | Upload image to Cloudinary (multipart/form-data) |
| `POST` | `/api/products` | **Admin** | Create product |
| `PUT` | `/api/products/:id` | **Admin** | Update product |
| `DELETE` | `/api/products/:id` | **Admin** | Soft-delete (archive) product |

**Query params for `GET /api/products`:**

| Param | Values | Default |
|---|---|---|
| `category` | `birthday` `wedding` `anniversary` `celebration` `custom` `desserts` | — |
| `featured` | `true` `false` | — |
| `page` | number | `1` |
| `limit` | number (max 50) | `20` |
| `sort` | `newest` `price_asc` `price_desc` | `sortOrder asc` |

**Product payload:**
```json
{
  "title": "Bespoke Tiered Floral Cake",
  "category": "wedding",
  "description": "Multi-tier cake with fresh blooms.",
  "pricingType": "starting_from",
  "price": 2400,
  "images": [{ "url": "https://res.cloudinary.com/...", "publicId": "m2-cakery/products/...", "isPrimary": true }],
  "featured": true,
  "published": true,
  "sortOrder": 1
}
```

---

## Security Design

- **No credentials in responses** — error messages are sanitized; secrets never surface to clients
- **No public registration** — admin accounts only via `npm run seed:admin`
- **Helmet** — security HTTP headers on all responses
- **CORS** — restricted to `CLIENT_URL` origins only
- **JWT** — HS256, configurable expiry (`JWT_EXPIRES_IN`), verified on every protected request
- **Multer** — files buffered in memory only; never written to local disk
- **Cloudinary** — assets streamed directly from buffer; error codes 401/403 produce safe diagnostic logs server-side without leaking credentials

---

## Deployment (Render)

- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`
- **Environment**: Node.js >= 18

Set all environment variables in the Render dashboard (never commit `.env`).

See [`../docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md) for the complete infrastructure guide.
