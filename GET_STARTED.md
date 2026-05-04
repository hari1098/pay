# 🚀 PaisaAds - Get Started in 5 Minutes

**A Complete Full-Stack Advertisement Platform**

> Everything is already installed and ready to run locally!

---

## ⚡ Super Quick Start

```bash
# Clone or download the project
git clone https://github.com/hari1098/pay.git
cd pay

# Mac/Linux - Run both servers automatically
./start.sh

# OR Windows - Run both servers automatically
start.bat

# OR Manually start in two terminal windows:
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

**Then open:** http://localhost:3000

---

## 📦 What You Get

✅ **Frontend Ready to Run**
- Next.js 15 with React 19
- All 544 packages installed
- Configuration: `frontend/.env.local`
- Node modules: `frontend/node_modules/` (651 MB)

✅ **Backend Ready to Run**
- NestJS with TypeORM
- All 1080 packages installed
- Configuration: `backend/.env`
- Node modules: `backend/node_modules/` (458 MB)

✅ **Documentation**
- `INSTALLATION_GUIDE.md` - Detailed setup
- `frontend/README.md` - Frontend docs
- `backend/README.md` - Backend docs

---

## 🔧 System Requirements

Before running locally, install:

1. **Node.js 18+** (LTS recommended)
   - Download: https://nodejs.org/
   - Verify: `node --version && npm --version`

2. **PostgreSQL 14+**
   - Download: https://www.postgresql.org/download/
   - Verify: `psql --version`
   - Create database: See INSTALLATION_GUIDE.md

3. **MongoDB 6+** (Optional)
   - Download: https://www.mongodb.com/try/download/community

---

## 📂 Project Structure

```
pay/
├── frontend/                    # Next.js 15 App (React 19)
│   ├── src/                    # Source code
│   ├── public/                 # Static files
│   ├── package.json            # Dependencies
│   ├── .env.local              # Config (API endpoint)
│   ├── node_modules/           # 651 MB - Already installed!
│   └── README.md               # Frontend docs
│
├── backend/                     # NestJS App
│   ├── src/                    # Source code
│   ├── package.json            # Dependencies
│   ├── .env                    # Config (Database, JWT, etc)
│   ├── node_modules/           # 458 MB - Already installed!
│   └── README.md               # Backend docs
│
├── INSTALLATION_GUIDE.md        # Complete setup guide
├── GET_STARTED.md              # This file
├── start.sh                    # Auto-start script (Mac/Linux)
├── start.bat                   # Auto-start script (Windows)
└── README.md                   # Project overview
```

---

## 🎯 Running the Application

### Option 1: Automatic Start (Easiest)

**Mac/Linux:**
```bash
chmod +x start.sh    # Make executable (one time only)
./start.sh
```

**Windows:**
```bash
start.bat
```

Both servers start in separate windows!

---

### Option 2: Manual Start in Two Terminals

**Terminal 1 - Backend (Port 3002):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Port 3000):**
```bash
cd frontend
npm run dev
```

---

### Option 3: Manual Start with npx

**Terminal 1:**
```bash
cd backend && npx concurrently "npm run dev"
```

**Terminal 2:**
```bash
cd frontend && npx concurrently "npm run dev"
```

---

## 🌐 Access Your Application

Once both servers are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | User-facing website |
| **Backend API** | http://localhost:3002 | API endpoints |
| **Backend Health** | http://localhost:3002/api/health | Check backend status |

---

## 📝 Configuration Files

### Frontend (.env.local)
Located at: `frontend/.env.local`
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Backend (.env)
Located at: `backend/.env`
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

---

## 🗄️ Database Setup

### PostgreSQL

Create the database and user:

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE paisaads;
CREATE USER paisaads_user WITH PASSWORD 'HEROsprint@123';
GRANT ALL PRIVILEGES ON DATABASE paisaads TO paisaads_user;
\q
```

**Credentials Already Set:**
- Host: localhost
- Port: 5432
- Username: postgres
- Password: HEROsprint@123
- Database: paisaads

---

## ✅ Verify Everything Works

### Test Backend
```bash
curl http://localhost:3002/api/health
```

Expected response: `{"status":"ok"}`

### Test Frontend
Open browser: http://localhost:3000

Should see: PaisaAds homepage with navigation

---

## 🚀 Features Available

### User Features
- ✅ User registration & login
- ✅ Create advertisements (Line, Poster, Video)
- ✅ Edit & delete own ads
- ✅ View own ads dashboard
- ✅ Search & filter ads
- ✅ User profile management

### Admin Features
- ✅ View all ads
- ✅ Approve/reject ads
- ✅ Manage configurations
- ✅ View reports
- ✅ User management

### Technical Features
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ File uploads (images/videos)
- ✅ Responsive design
- ✅ Dark mode ready
- ✅ Type-safe (TypeScript)

---

## 🐛 Common Issues & Solutions

### "Port 3000 already in use"
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
cd frontend && npm run dev -- -p 3001
```

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
psql -U postgres -l | grep paisaads

# If not found, create it:
createdb -U postgres paisaads
```

### "Module not found" errors
```bash
# Reinstall dependencies
cd frontend && npm install --legacy-peer-deps
cd ../backend && npm install --legacy-peer-deps
```

### "Backend API returns 404"
- Ensure backend is running on port 3002
- Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3002`
- Restart frontend after changing .env

---

## 📚 Documentation

For detailed information, see:

- **INSTALLATION_GUIDE.md** - Complete setup & troubleshooting
- **frontend/README.md** - Frontend architecture & scripts
- **backend/README.md** - Backend architecture & API docs
- **frontend/SETUP_GUIDE.md** - Frontend detailed setup

---

## 🎨 Available Commands

### Frontend Commands
```bash
cd frontend

npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Check code quality
npm run format    # Format code
```

### Backend Commands
```bash
cd backend

npm run dev       # Start development server
npm run start     # Start production build
npm run build     # Build the project
npm run test      # Run tests
npm run format    # Format code
```

---

## 🔐 Security Notes

- Change default database password in production
- Change JWT secret to a long random string
- Use HTTPS in production
- Set proper CORS origins
- Use environment variables for secrets
- Never commit .env files

---

## 🌍 Deployment

To deploy to production (Vercel, AWS, etc.):

1. Update environment variables for production
2. Build both frontend and backend
3. Deploy frontend to Vercel: `npm run build && npm run start`
4. Deploy backend to server: `npm run build && npm start`
5. Update database to production database
6. Update API URLs

---

## 📞 Support

- Check logs for detailed error messages
- Verify all prerequisites are installed
- Ensure ports 3000 and 3002 are available
- Review INSTALLATION_GUIDE.md for troubleshooting
- Check database connectivity

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 You're All Set!

Everything is ready to go. Just:

1. ✅ Install Node.js & PostgreSQL (if not already done)
2. ✅ Create database
3. ✅ Run `./start.sh` or `start.bat` or manually start both servers
4. ✅ Open http://localhost:3000
5. ✅ Create account and explore!

**Happy coding!** 🚀

---

**Questions?** See INSTALLATION_GUIDE.md for detailed setup instructions and troubleshooting.
