# M² Cakery — Full-Stack Bakery Website

Premium bakery website and admin CMS for M² Cakery (Jakh, Samba).

## Architecture

```
Customer Storefront (React + Vite)   →   /
Admin CMS (React, isolated)          →   /admin/*
Express REST API (Node.js)           →   backend/
MongoDB Atlas                        →   Products + Admins
Cloudinary                           →   Product photos (WebP)
```

---

## Quick Start (Local Development)

### 1. Backend

```bash
cd backend
cp .env.example .env        # fill in your credentials
npm install
npm run dev                 # starts on http://localhost:5001
```

### 2. Frontend

```bash
# at repo root
cp .env.example .env.local  # set VITE_API_URL=http://localhost:5001/api
npm install
npm run dev                 # starts on http://localhost:5173
```

### 3. Create Admin Account

```bash
cd backend
npm run seed:admin your@email.com YourStrongPassword123!
```

---

## Scripts

| Location | Command | Description |
|---|---|---|
| root | `npm run dev` | Start Vite dev server |
| root | `npm run build` | Production build → `dist/` |
| root | `npm run preview` | Preview production build locally |
| backend | `npm run dev` | Start API with nodemon hot-reload |
| backend | `npm start` | Start API (production) |
| backend | `npm run seed:admin` | Create or rotate admin credentials |
| backend | `npm test` | Run backend API tests |

---

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full production deployment guide:

- **Frontend** → Vercel (Root directory: `./`, Build: `npm run build`, Output: `dist`)
- **Backend** → Render (Root directory: `backend`, Start: `npm start`)
- **Database** → MongoDB Atlas
- **Images** → Cloudinary (WebP, 5 MB max)

### Key Environment Variables

**Frontend (`.env` or Vercel dashboard):**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

**Backend (`backend/.env` or Render dashboard):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-32-char-minimum-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=https://your-frontend-domain.com
```

---

## Admin CMS

Navigate to `/admin` after deployment (or `http://localhost:5173/admin` locally).

- Login with credentials created via `npm run seed:admin`
- Create, edit, publish, and archive products
- Upload product photos directly to Cloudinary
- Products appear on the public storefront automatically

---

## Project Structure

```
m2-cakery/
├── src/                        # React frontend (customer storefront + admin)
│   ├── admin/                  # Admin CMS (isolated, /admin/* routes)
│   ├── components/             # Customer-facing UI components
│   ├── data/                   # Static fallback catalog & category definitions
│   ├── hooks/                  # useProducts (API + static fallback)
│   ├── services/               # productApi.js (public API client)
│   └── utils/                  # WhatsApp helper
├── backend/                    # Node.js + Express API
│   ├── scripts/createAdmin.js  # Admin account provisioning CLI
│   └── src/
│       ├── config/             # MongoDB & Cloudinary setup
│       ├── controllers/        # Auth, Product, Health handlers
│       ├── middleware/         # Auth, validation, error handling
│       ├── models/             # Admin, Product Mongoose schemas
│       ├── routes/             # API route definitions
│       └── services/           # Cloudinary upload service
├── docs/DEPLOYMENT.md          # Production deployment guide
├── public/_redirects           # SPA routing for Netlify
├── vercel.json                 # SPA routing for Vercel
└── index.html                  # Entry point with full SEO meta tags
```
