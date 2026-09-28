# M² Cakery — Production Deployment & Infrastructure Guide

This guide provides end-to-end documentation for deploying M² Cakery to production environments (such as Vercel/Netlify for the frontend, Render/Railway/Fly.io for the backend, MongoDB Atlas for database storage, and Cloudinary for media assets).

---

## 1. System Architecture

```text
┌───────────────────────────────┐
│     Customer Storefront       │ (Vite + React SPA)
│    https://m2cakery.com       │ Static assets hosted on Vercel / Netlify
└──────────────┬────────────────┘
               │
               │ HTTPS REST API Requests (VITE_API_URL)
               ▼
┌───────────────────────────────┐
│      Express Backend API      │ (Node.js >= 18)
│  https://api.m2cakery.com/api │ Hosted on Render / Railway / Fly.io
└──────────────┬────────────────┘
               │
       ┌───────┴────────────────────────┐
       ▼                                ▼
┌──────────────────────┐    ┌──────────────────────┐
│    MongoDB Atlas     │    │  Cloudinary Media    │
│  (Product & Admin)   │    │  (Photos / WebP)     │
└──────────────────────┘    └──────────────────────┘
```

---

## 2. Environment Variables Matrix

### Backend (`backend/.env`) — Server-Side Only

> [!CAUTION]
> Never expose these variables to the frontend or commit `.env` to Git.

| Variable | Required | Description | Example Placeholder |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | HTTP listening port (assigned automatically by most PaaS) | `5001` |
| `NODE_ENV` | Yes | Runtime mode (`production` disables dev stack traces) | `production` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string with replica set | `mongodb+srv://<user>:<password>@cluster.mongodb.net/m2_cakery?retryWrites=true&w=majority` |
| `CLIENT_URL` | Yes | Whitelisted frontend origin(s) for CORS (comma-separated if multiple) | `https://m2cakery.com,https://www.m2cakery.com` |
| `JWT_SECRET` | Yes | Cryptographic secret for signing Admin JWT tokens (min 32 chars) | `use-a-strong-random-hex-or-base64-string` |
| `JWT_EXPIRES_IN` | No | Token validity duration (default: `24h`) | `24h` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API Secret | `your_api_secret` |

### Frontend (`.env` or Hosting Provider Dashboard) — Browser-Safe

| Variable | Required | Description | Example Placeholder |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | Full base URL pointing to the deployed backend `/api` endpoint | `https://api.m2cakery.com/api` |

> [!IMPORTANT]
> The frontend bundles `VITE_API_URL` at build time. If you update `VITE_API_URL` on your hosting provider, you must trigger a **Redeploy / Rebuild**.

---

## 3. MongoDB Atlas Configuration

### Cluster Setup
1. Create a MongoDB Atlas cluster (M0 Free tier is sufficient for small business catalogs; M10+ recommended for high-concurrency production).
2. Create a Database User under **Database Access**:
   - Authentication Method: **Password**
   - Role: **Read and write to any database** (or scoped to `m2_cakery`)
   - Avoid special characters like `@`, `:`, `/`, or `?` in the password, or URL-encode them.

### Network Access (IP Whitelist)
1. Go to **Network Access** → **IP Access List**.
2. Determine your backend hosting provider's networking mode:
   - **Static Outbound IP (e.g. AWS EC2, DigitalOcean Droplet, Render with Static Outbound IP add-on)**: Add the specific IP address `/32`.
   - **Dynamic IP Hosting (e.g. Standard Render, Railway, Fly.io, Vercel Functions)**: If your backend platform does not provide a fixed outbound IP, MongoDB Atlas requires allowing access from anywhere (`0.0.0.0/0`).
3. **Security Safeguards when using `0.0.0.0/0`**:
   - Use an exceptionally strong database password (>= 24 random characters).
   - Use dedicated database credentials with least-privilege permissions.
   - Monitor the MongoDB Atlas alert logs for unexpected authentication attempts.

---

## 4. Cloudinary Setup & Verification

1. Sign up or log in to [Cloudinary](https://cloudinary.com/).
2. Retrieve your **Cloud Name**, **API Key**, and **API Secret** from the Cloudinary Console Dashboard.
3. Verify that your account is active and verified:
   - Newly created Cloudinary accounts may require email confirmation before upload APIs are unlocked.
   - If uploads fail with HTTP `403 Forbidden`, confirm in Cloudinary **Settings > Security** that unsigned/restricted upload policies or account quotas are not blocking server-side SDK uploads.
4. Image handling is pre-configured in `backend/src/services/cloudinaryService.js`:
   - Enforces format standardization to `webp` with `quality: auto:good`.
   - Enforces a 5MB maximum file size limit.
   - Accepts MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/jpg`.
   - Deleting a product image during product update triggers automated Cloudinary asset deletion using the stored `publicId`.
   - Soft-archiving a product retains its images for data preservation.

---

## 5. Backend Deployment (Render / Railway / Fly.io)

### Configuration
- **Root Directory**: `backend` (if repo root has both frontend and backend)
- **Environment**: Node.js (Version >= 18)
- **Build Command**: `npm install`
- **Start Command**: `npm start` (Runs `node src/server.js`)
- **Health Check Path**: `/api/health`

### Health Check Verification
Once deployed, verify that the health check responds with HTTP 200:
```bash
curl -i https://your-backend-app.onrender.com/api/health
```
Expected response:
```json
{
  "success": true,
  "message": "M² Cakery API is running",
  "environment": "production"
}
```

---

## 6. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)

### Configuration
- **Root Directory**: `./` (Project root)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL=https://your-backend-app.onrender.com/api`

### Client-Side SPA Routing
Because M² Cakery uses client-side routing (`/admin`, `/admin/login`, `/admin/products/new`), the hosting provider must redirect all non-file requests to `index.html`.

#### For Vercel (`vercel.json` in root if needed):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### For Netlify (`public/_redirects`):
```text
/*    /index.html   200
```

---

## 7. CORS Configuration

The backend dynamically checks incoming `Origin` headers against the `CLIENT_URL` environment variable in `backend/src/app.js`:

```javascript
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173'];
```

- When deploying, set `CLIENT_URL` to your production frontend URL (e.g. `https://m2cakery.com`).
- If you have multiple domains (e.g. `https://m2cakery.com` and `https://m2-cakery.vercel.app`), separate them with a comma:
  `CLIENT_URL=https://m2cakery.com,https://m2-cakery.vercel.app`
- Do NOT include trailing slashes in `CLIENT_URL`.

---

## 8. Admin Provisioning & Credential Rotation

Public registration is intentionally disabled. Provision or rotate the administrator account using the secure CLI tool.

### Creating Initial Admin or Rotating Password

Run the CLI command on the server or via a remote shell connected to the production database:

```bash
cd backend
npm run seed:admin <admin-email> <strong-unique-password>
```

Or pass via environment variables (recommended in CI/CD or platform shell to avoid command history retention):
```bash
ADMIN_EMAIL=owner@m2cakery.com ADMIN_PASSWORD=YourStrongUniquePassword! npm run seed:admin
```

> [!NOTE]
> If the email already exists in MongoDB, the script safely updates the password hash without altering or deleting other database records. Passwords must be at least 8 characters long.

---

## 9. First Production Verification Workflow

1. Navigate to `https://your-frontend-domain.com/admin/login`.
2. Sign in with the provisioned administrator credentials.
3. Access the Admin Dashboard at `/admin/products`.
4. Create a test product:
   - Title: `Production Verification Cake`
   - Category: `birthday`
   - Price: `1999`
   - Upload an authentic photograph (JPEG/PNG/WebP, < 5MB).
   - Check `Published` and `Featured`.
   - Click **Save Product**.
5. Open the customer-facing storefront in a new incognito window:
   - Confirm the new product appears in the portfolio and featured cake section.
   - Confirm the Cloudinary photo loads via HTTPS.
   - Confirm the modal and WhatsApp enquiry button open as expected.
6. Return to `/admin/products`, select the verification cake, and click **Archive**.
7. Confirm the test product disappears from the public catalog.

---

## 10. Operational Security & Maintenance

1. **HTTPS Enforcement**: Ensure both frontend and backend domains have active SSL/TLS certificates. Never mix HTTP API calls from an HTTPS frontend.
2. **Graceful Shutdown**: The backend responds to `SIGTERM` and `SIGINT` signals, closing the HTTP server first to drain active requests before cleanly disconnecting from MongoDB Atlas.
3. **Database Backups**:
   - MongoDB Atlas provides automated daily snapshots on M10+ clusters.
   - For M0/free clusters, schedule regular export scripts (`mongodump`) or upgrade to dedicated tiers for automated point-in-time recovery.
4. **Cloudinary Asset Safety**: Soft-archiving products does not delete Cloudinary assets. Deleted images are only removed from Cloudinary when explicitly replaced or removed during a product update.
