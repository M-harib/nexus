#!/bin/bash
# Startup script for the entire Concept Dependency Tree Backend

echo "Starting Concept Dependency Tree Backend..."
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
mongosh --eval "db.version()" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠ MongoDB is not running. Start MongoDB with: mongod"
    exit 1
fi
echo "✓ MongoDB is running"
echo ""

# Start Flask backend
echo "Starting Flask backend on port 5000..."
cd flask-backend
python app.py &
FLASK_PID=$!
sleep 2

# Start Node.js server
echo "Starting Node.js server on port 3000..."
cd ../node-server
npm run dev &
NODE_PID=$!
sleep 2

echo ""
echo "=================================================="
echo "✓ Concept Dependency Tree Backend Started"
echo "=================================================="
echo ""
echo "Services:"
echo "  Flask (Python):   http://localhost:5000"
echo "  Node.js (Express): http://localhost:3000"
echo "  MongoDB:          mongodb://localhost:27017"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for interrupt
wait
