# PaisaAds - Advertisement Platform

A full-stack classified ads platform for posting and browsing advertisements across multiple categories. Supports three ad types: Line Ads (text), Poster Ads (image), and Video Ads.

## Architecture

```
Frontend (Next.js 15 + React 19)  -->  Supabase Edge Functions (Hono API)  -->  Supabase PostgreSQL
        :3000                                    :supabase.co/functions/v1/paisaads-api
```

- **Frontend**: Next.js 15 App Router, Tailwind CSS 4, shadcn/ui, TanStack Query, Zustand
- **API**: Supabase Edge Function (Deno + Hono) handling all REST endpoints
- **Database**: Supabase PostgreSQL with RLS policies
- **Auth**: JWT-based authentication with Bearer token, role-based access control

## Quick Start

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### 2. Configure Environment

Create `frontend/.env.local`:

```
JWT_SECRET=paisaads-super-secret-jwt-key-2024
NEXT_PUBLIC_API_URL=https://vhlafnxhkalzwzlcbidq.supabase.co/functions/v1/paisaads-api
```

### 3. Run the Frontend

```bash
cd frontend
npm run dev
```

The app runs at http://localhost:3000. The API is already deployed as a Supabase Edge Function -- no local backend needed.

## Test Accounts

| Phone | Password | Role |
|-------|----------|------|
| 9999999999 | password123 | SUPER_ADMIN |
| 8888888888 | password123 | USER (Customer) |
| 7777777777 | password123 | EDITOR |
| 6666666666 | password123 | REVIEWER |

## Key Pages

- `/` - Home page with featured ads
- `/search` - Search and filter ads
- `/register` - Register new account
- `/dashboard` - User dashboard (manage ads)
- `/mgmt/dashboard` - Admin dashboard (review, approve, manage)
- `/about-us`, `/contact`, `/faq`, `/privacy-policy`, `/terms-and-conditions` - Info pages

## API Endpoints

The API is deployed at: `https://vhlafnxhkalzwzlcbidq.supabase.co/functions/v1/paisaads-api/`

### Auth
- `POST /auth/login` - Login with phone + password
- `POST /auth/logout` - Logout
- `POST /auth/send-otp` - Send OTP for viewer login
- `POST /auth/verify-otp` - Verify OTP
- `GET /auth/profile` - Get current user profile (Bearer token required)

### Ads
- `GET /line-ad/today` - Get published line ads
- `GET /poster-ad/today` - Get published poster ads
- `GET /video-ad/today` - Get published video ads
- `POST /line-ad`, `POST /poster-ad`, `POST /video-ad` - Create ads (auth required)
- `PATCH /line-ad/:id/approve` - Approve ad (admin)
- `GET /line-ad/my-ads` - Get user's own ads (auth required)
- `GET /line-ad/status/:status` - Get ads by status

### Categories
- `GET /categories/tree` - Get full category hierarchy

### Dashboard & Reports
- `GET /ad-dashboard/user` - User dashboard stats (auth required)
- `GET /ad-dashboard/global` - Global dashboard stats
- `GET /reports/*` - Various reporting endpoints

### Configurations
- `GET /configurations/:key` - Get site configuration (faq, about-us, ad-pricing, etc.)

## Database Schema

15 tables in Supabase PostgreSQL:

- `user` - User accounts with roles
- `admin`, `customer` - User profile tables
- `otp` - One-time passwords for verification
- `main_category`, `category_one`, `category_two`, `category_three` - 4-level category hierarchy
- `line_ad`, `poster_ad`, `video_ad` - Advertisement tables
- `image` - Uploaded images
- `payment` - Payment records
- `ad_comment` - Review/approval comments
- `ad_position` - Ad placement positions

## Project Structure

```
project/
  frontend/           # Next.js 15 frontend application
    src/
      app/            # App Router pages
      components/     # React components (shadcn/ui based)
      lib/            # API client, services, types, hooks
    .env.local        # Environment variables
  supabase/
    functions/
      paisaads-api/  # Edge Function API (Hono)
  backend/           # Original NestJS backend (reference only)
```

## Original Backend (Reference)

The `backend/` directory contains the original NestJS backend. It requires PostgreSQL and MongoDB. In this deployment, the API has been re-implemented as a Supabase Edge Function for serverless operation. The original backend can still be run locally:

```bash
cd backend
npm install
# Configure .env with DB credentials
npm run start:dev
```
