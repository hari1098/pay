#!/bin/bash

# PaisaAds - Start Both Frontend and Backend

echo "======================================"
echo "PaisaAds - Starting Full Stack"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"
echo ""

# Start Backend
echo "🚀 Starting Backend (Port 3002)..."
echo "📂 Location: backend/"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 3

# Start Frontend
echo ""
echo "🚀 Starting Frontend (Port 3000)..."
echo "📂 Location: frontend/"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "======================================"
echo "✅ Both servers are starting!"
echo "======================================"
echo ""
echo "📊 Services:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:3002"
echo ""
echo "📝 Logs:"
echo "  Backend:   Check terminal 1"
echo "  Frontend:  Check terminal 2"
echo ""
echo "⏹️  To stop: Press Ctrl+C twice"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
