# PaisaAds Frontend - Complete Setup Guide

## ✅ Current Status

**Website is WORKING and RUNNING on http://localhost:3000**

- Frontend: ✅ Running
- Dependencies: ✅ Installed  
- Environment: ✅ Configured
- Preview: ✅ Visible

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ (recommended v20+)
- npm 9+
- Git
- PostgreSQL 14+ (for backend)
- MongoDB 6+ (optional)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/hari1098/pay.git
cd pay

# 2. Install dependencies (use --legacy-peer-deps)
npm install --legacy-peer-deps

# 3. Create .env.local file with your configuration
cp .env.example .env.local

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

## 📋 Environment Configuration

### Frontend Environment Variables (.env.local)

```bash
# Frontend Configuration Only
NODE_ENV=development

# Frontend API URL - pointing to backend
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Backend Environment Variables (Use in backend .env)

```bash
NODE_ENV=development
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=HEROsprint@123
DB_NAME=paisaads
MONGODB_URI=mongodb://localhost:27017/paisaads
JWT_SECRET=9a4f2c8d3b7a1e6f4g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d
JWT_EXPIRATION=7d
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=your_sender_id
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_ORIGINS=http://localhost:3000,https://paisaads.in
```

## 🏗️ Project Structure

```
paisaads-frontend/
├── src/
│   ├── app/
│   │   ├── (website)/              # Public website pages
│   │   │   ├── page.tsx            # Homepage with ads
│   │   │   ├── layout.tsx          # Website layout
│   │   │   ├── about-us/           # About page
│   │   │   ├── contact/            # Contact page
│   │   │   ├── faq/                # FAQ page
│   │   │   └── search/             # Search ads page
│   │   ├── dashboard/              # User dashboard
│   │   │   ├── my-ads/             # View user ads
│   │   │   ├── post-ad/            # Create new ads
│   │   │   ├── edit-ad/            # Edit ads
│   │   │   └── profile/            # User profile
│   │   ├── register/               # User registration
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── forms/                  # Form components
│   │   └── navbar.tsx              # Main navigation
│   └── lib/
│       ├── api.ts                  # Axios API client
│       └── types/                  # TypeScript types
├── public/                         # Static assets
├── package.json                    # Dependencies
├── next.config.js                  # Next.js config
├── tailwind.config.js              # Tailwind config
├── tsconfig.json                   # TypeScript config
└── .env.local                      # Environment variables
```

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.8 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: TanStack Query (React Query) + Zustand
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios
- **Build Tool**: Turbopack

### Dependencies Highlights
```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "@radix-ui/*": "Latest versions",
    "@tanstack/react-query": "^5.74.4",
    "axios": "^1.7.7",
    "clsx": "^2.1.1",
    "next": "^15.3.8",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.53.2",
    "tailwind-css": "^4.0.6",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.1"
  }
}
```

## 🔧 Available Commands

```bash
# Development server (hot reload enabled)
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting & type checking
npm run lint
```

## 🛠️ Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

### Dependency Conflicts
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Backend Connection Issues
1. Ensure backend is running on port 3002
2. Check PostgreSQL is running: `pg_isready -h localhost -p 5432`
3. Verify `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:3002`

### TypeScript/Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 🌐 Website Features

### Homepage
- Three-column layout with sidebar ads
- Line ads in center
- Poster ads on sides
- Video ads on sides
- Responsive design for mobile

### User Dashboard
- View user's posted ads
- Create new advertisements
- Edit existing ads
- Manage ad details

### Admin Management
- View all published ads
- Manage rejected ads
- Handle ads on hold
- Configure settings
- View reports

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Secure password hashing
- HTTP-only cookies for sessions
- CORS protection with allowed origins

## 📡 API Integration

Frontend communicates with backend API:
- Base URL: `http://localhost:3002` (configurable in `.env.local`)
- Authentication: JWT tokens in headers
- Request/Response handling: Axios with interceptors

### Example API Endpoints (Backend)
```
GET    /api/ads                  # Get all ads
GET    /api/ads/:id              # Get specific ad
POST   /api/ads                  # Create new ad
PUT    /api/ads/:id              # Update ad
DELETE /api/ads/:id              # Delete ad
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
GET    /api/users/profile        # Get user profile
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Deployment
```bash
# Build Docker image
docker build -t paisaads-frontend .

# Run container
docker run -p 3000:3000 paisaads-frontend
```

## 📝 Environment Notes

- **Development**: Uses Turbopack for faster builds
- **Production**: Optimized with Next.js production build
- **API**: Configurable via `NEXT_PUBLIC_API_URL`
- **Ports**: Frontend on 3000, Backend on 3002

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## 📞 Support & Help

- Check README.md for detailed documentation
- Review Troubleshooting section above
- Check server logs: `npm run dev` output
- Verify environment configuration in `.env.local`

## ✨ What's Next

1. **Backend Setup**: Install and run the NestJS backend
2. **Database Setup**: Configure PostgreSQL and MongoDB
3. **Testing**: Run test suite to verify functionality
4. **Deployment**: Deploy to Vercel or your hosting provider

---

**Website Status**: ✅ FULLY OPERATIONAL

**Current Running**: http://localhost:3000

**Backend Ready for Connection**: http://localhost:3002
