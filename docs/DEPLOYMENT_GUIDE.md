# Production Deployment & Hosting Guide

## 1. Hosting Overview
MERKATO is built for zero-configuration, lightning-fast edge hosting:
- **Frontend**: Render, Vercel, Netlify, Cloudflare Pages, or GitHub Pages
- **Backend**: Render Web Service, Fly.io, Railway, or AWS Lightsail

---

## 2. Environment Variables (.env)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/merkato?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
TELEBIRR_APP_ID=your_telebirr_app_id
TELEBIRR_MERCHANT_CODE=your_telebirr_shortcode
CORS_ORIGIN=https://merkato.com
```

---

## 3. Docker Containerization
Run using Docker Compose:
```bash
docker-compose up -d --build
```
