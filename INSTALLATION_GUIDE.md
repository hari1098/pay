# PaisaAds - Complete Installation & Setup Guide

This project is a full-stack advertisement platform with **separate Frontend and Backend** applications.

## 📁 Project Structure

```
pay/
├── frontend/                  # Next.js 15 Frontend Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.local            # Frontend configuration
│   ├── node_modules/         # Already installed
│   └── README.md
│
├── backend/                   # NestJS Backend Application
│   ├── src/
│   ├── package.json
│   ├── .env                  # Backend configuration
│   ├── node_modules/         # Already installed
│   └── README.md
│
└── INSTALLATION_GUIDE.md      # This file
```

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Clone the Repository (On Your Local Machine)
```bash
git clone https://github.com/hari1098/pay.git
cd pay
```

### Step 2: Install Dependencies (Already Done - But You Can Reinstall)

**For Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
```

**For Backend:**
```bash
cd ../backend
npm install --legacy-peer-deps
```

### Step 3: Start Both Applications

**Terminal 1 - Start Backend (Port 3002):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend (Port 3000):**
```bash
cd frontend
npm run dev
```

Then open your browser to **http://localhost:3000**

---

## 📋 Detailed Setup Instructions

### Prerequisites Required

Ensure you have these installed on your local machine:
- **Node.js** v18+ (LTS recommended, v20+ preferred)
  - Download from https://nodejs.org/
  - Check: `node --version` and `npm --version`
- **PostgreSQL** 14+ (for database)
  - Download from https://www.postgresql.org/download/
  - Check: `psql --version`
- **MongoDB** 6+ (optional, for backend)
  - Download from https://www.mongodb.com/try/download/community

### Database Setup

#### 1. PostgreSQL Setup
```bash
# Create database
psql -U postgres

# In PostgreSQL prompt:
CREATE DATABASE paisaads;
CREATE USER paisaads_user WITH PASSWORD 'HEROsprint@123';
ALTER ROLE paisaads_user SET client_encoding TO 'utf8';
ALTER ROLE paisaads_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE paisaads_user SET default_transaction_deferrable TO on;
ALTER ROLE paisaads_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE paisaads TO paisaads_user;
\q
```

Or use the provided credentials:
- **Host:** localhost
- **Port:** 5432
- **Username:** postgres
- **Password:** HEROsprint@123
- **Database:** paisaads

#### 2. MongoDB Setup (Optional)
```bash
# Ensure MongoDB is running
mongod

# Verify connection
mongo mongodb://localhost:27017/paisaads
```

---

## 🔧 Backend Setup (NestJS)

### Configuration

The backend `.env` file is already created at `backend/.env` with these settings:

```env
NODE_ENV=development
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=HEROsprint@123
DB_NAME=paisaads
JWT_SECRET=9a4f2c8d3b7a1e6f4g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d
JWT_EXPIRATION=7d
```

### Running Backend

```bash
cd backend

# Install dependencies (if not already installed)
npm install --legacy-peer-deps

# Run in development mode
npm run dev

# Or run with npm start
npm start
```

**Backend will run on:** http://localhost:3002

**API Endpoints Available:**
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/ads` - List all ads
- `POST /api/ads` - Create new ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad
- And more...

---

## 🎨 Frontend Setup (Next.js)

### Configuration

The frontend `.env.local` file is already created at `frontend/.env.local` with these settings:

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Running Frontend

```bash
cd frontend

# Install dependencies (if not already installed)
npm install --legacy-peer-deps

# Run in development mode
npm run dev

# Or build and run production mode
npm run build
npm run start
```

**Frontend will run on:** http://localhost:3000

**Features Available:**
- Homepage with advertisement listings
- User registration & login
- User dashboard (My Ads, Create Ad, Edit Ad)
- Admin management panel
- Search & filter ads
- User profile management
- Responsive mobile design

---

## 🌐 Running Both Together

### Method 1: Using Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd pay/backend
npm run dev
# Backend running on http://localhost:3002
```

**Terminal 2 - Frontend:**
```bash
cd pay/frontend
npm run dev
# Frontend running on http://localhost:3000
```

### Method 2: Using Single Terminal (Background Process)

**Mac/Linux:**
```bash
cd pay/backend && npm run dev &
cd ../frontend && npm run dev
```

**Windows:**
```bash
# Terminal 1:
cd pay\backend && npm run dev

# Terminal 2 (New):
cd pay\frontend && npm run dev
```

---

## 🔄 Data Flow

```
User Browser (http://localhost:3000)
        ↓
Frontend (React/Next.js)
        ↓
API Calls (http://localhost:3002/api)
        ↓
Backend (NestJS)
        ↓
Database (PostgreSQL/MongoDB)
```

---

## 📦 Package Information

### Frontend Packages
- **Next.js** 15.3.8 - React framework
- **React** 19 - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client

### Backend Packages
- **NestJS** - Node.js framework
- **TypeORM** - ORM for database
- **PostgreSQL** - Primary database
- **MongoDB** - Optional NoSQL database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Class Validator** - Input validation
- **Passport** - Authentication middleware

---

## ✅ Verification Checklist

After starting both applications, verify:

- [ ] **Backend Running**: Visit http://localhost:3002/api/health
  - Should return: `{"status":"ok"}`

- [ ] **Frontend Running**: Visit http://localhost:3000
  - Should see: PaisaAds homepage with navigation menu

- [ ] **Database Connected**: Check backend console
  - Should show: "Connected to database successfully"

- [ ] **Frontend-Backend Communication**: Create an account on frontend
  - Should register successfully in backend database

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000` or `:::3002`

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3002
npx kill-port 3002

# Or specify different port
npm run dev -- -p 3001
```

### Database Connection Failed

**Error:** `connection refused at localhost:5432`

**Solution:**
1. Ensure PostgreSQL is installed and running
2. Check credentials in `backend/.env`
3. Verify database exists: `psql -U postgres -l | grep paisaads`
4. Create database if missing: `createdb -U postgres paisaads`

### Dependencies Not Installed

**Error:** `Cannot find module 'next'` or similar

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Backend CORS is already configured for `http://localhost:3000`
- Check `backend/.env` has correct `ALLOWED_ORIGINS`
- Restart backend server after changing .env

### Next.js Build Errors

**Error:** `TypeError: Cannot read property 'X' of undefined`

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📚 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend Scripts
```bash
npm run dev          # Start dev server on port 3002
npm run start        # Start production build
npm run build        # Build the project
npm run test         # Run tests
npm run format       # Format code
```

---

## 🔐 Environment Variables Explained

### Frontend (.env.local)
| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3002` |
| `NEXT_PUBLIC_BASE_URL` | Frontend URL | `http://localhost:3000` |

### Backend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3002` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `HEROsprint@123` |
| `DB_NAME` | Database name | `paisaads` |
| `JWT_SECRET` | JWT signing key | Long random string |
| `JWT_EXPIRATION` | Token expiration | `7d` |

---

## 📖 Project Documentation

- **Frontend README:** See `frontend/README.md`
- **Backend README:** See `backend/README.md`
- **Frontend Setup Guide:** See `frontend/SETUP_GUIDE.md`

---

## 🚀 Next Steps

1. ✅ Clone repository
2. ✅ Install dependencies (already done)
3. ✅ Configure databases (PostgreSQL/MongoDB)
4. ✅ Start backend server
5. ✅ Start frontend server
6. ✅ Open http://localhost:3000
7. ✅ Create account and test features
8. ✅ Check admin panel for more features

---

## 💡 Tips

- **Restart servers after changing `.env`** - Environment variables are loaded at startup
- **Keep two terminals open** - One for backend, one for frontend
- **Check console errors** - Both frontend and backend log useful debug info
- **Use React DevTools** - Browser extension for debugging React components
- **Monitor database** - Use PostgreSQL GUI tools like pgAdmin for database inspection

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console logs for error messages
3. Ensure all prerequisites are installed
4. Check that ports 3000 and 3002 are available
5. Verify database is running and accessible

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Happy coding! 🎉**
