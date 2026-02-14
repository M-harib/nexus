# 🚀 START HERE - Quick Navigation Guide

## Welcome to Concept Dependency Tree Backend!

A complete framework for managing skill trees with prerequisite dependencies using Flask, Node.js, and MongoDB.

---

## 📖 Documentation - Read in This Order

### 1. **Quick Start (5 min)** → [`QUICKSTART.md`](QUICKSTART.md)
   - Setup & installation
   - Run all services
   - First API calls
   - Troubleshooting

### 2. **Project Overview (10 min)** → [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)
   - Feature overview
   - Architecture diagram
   - Use cases
   - Key concepts

### 3. **Full Documentation (20 min)** → [`README.md`](README.md)
   - Complete API reference
   - Data models
   - Workflow examples
   - Integration notes

### 4. **Technical Deep Dive (30 min)** → [`ARCHITECTURE.md`](ARCHITECTURE.md)
   - System design details
   - Data flow diagrams
   - Database schemas
   - Scalability & performance
   - Security considerations

### 5. **File Structure Reference** → [`FILE_STRUCTURE.md`](FILE_STRUCTURE.md)
   - Directory breakdown
   - File descriptions
   - Component roles

### 6. **API Examples** → [`EXAMPLES.json`](EXAMPLES.json)
   - 15+ real API examples
   - Request/response pairs
   - Various scenarios

---

## 🏃 Quick Start (Choose Your Path)

### Path A: Docker (Easiest - 2 minutes)
```bash
docker-compose up
# All services start automatically
# Visit: http://localhost:3000 or http://localhost:5000
```

### Path B: Manual Setup (5 minutes)
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Flask
cd flask-backend
pip install -r requirements.txt
python app.py

# Terminal 3: Node.js
cd node-server
npm install
npm run dev
```

---

## 🎯 Common Tasks

### Create a Concept
```bash
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -d '{
    "concept_id": "matrices",
    "title": "Introduction to Matrices",
    "category": "Linear Algebra",
    "difficulty_level": 1,
    "prerequisites": []
  }'
```

### Create Dependent Concept
```bash
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -d '{
    "concept_id": "matrix_mult",
    "title": "Matrix Multiplication",
    "prerequisites": ["matrices"],
    "difficulty_level": 2
  }'
```

### Track User Progress
```bash
# Start learning
curl -X POST http://localhost:3000/api/users/alice/skills/start \
  -H "Content-Type: application/json" \
  -d '{"concept_id": "matrices"}'

# Complete concept
curl -X POST http://localhost:3000/api/users/alice/skills/complete \
  -H "Content-Type: application/json" \
  -d '{"concept_id": "matrices"}'

# Get next steps
curl http://localhost:3000/api/users/alice/available-concepts

# Export progress
curl http://localhost:3000/api/users/alice/export > backup.json
```

---

## 📁 Project Structure

```
concept-tree-backend/
├── flask-backend/          # Python backend (Port 5000)
├── node-server/            # Node.js gateway (Port 3000)
├── data/
│   └── skill_trees/        # User JSON exports
├── examples/
│   └── initialize_db.py    # Load sample data
└── Documentation:
    ├── README.md           ← Full API docs
    ├── QUICKSTART.md       ← 5-min setup
    ├── ARCHITECTURE.md     ← System design
    ├── PROJECT_SUMMARY.md  ← Feature overview
    ├── FILE_STRUCTURE.md   ← Code breakdown
    └── EXAMPLES.json       ← API examples
```

---

## 🔧 Configuration

### Flask (flask-backend/.env)
```env
MONGO_URI=mongodb://localhost:27017/concept-tree
FLASK_ENV=development
FLASK_DEBUG=true
```

### Node.js (node-server/.env)
```env
MONGO_URI=mongodb://localhost:27017/concept-tree
NODE_ENV=development
PORT=3000
FLASK_API_URL=http://localhost:5000
```

---

## 📊 API Overview

### 8 Concept Endpoints
- `POST /api/concepts` - Create
- `GET /api/concepts` - List
- `GET /api/concepts/:id` - Get
- `PUT /api/concepts/:id` - Update
- `DELETE /api/concepts/:id` - Delete
- `GET /api/concepts/:id/dependencies` - Prerequisites
- `GET /api/concepts/:id/dependents` - Dependents
- `GET /api/concepts/category/:cat/tree` - Category graph

### 7 User Endpoints
- `GET /api/users/:uid/skills` - Progress
- `POST /api/users/:uid/skills/complete` - Mark done
- `POST /api/users/:uid/skills/start` - Start
- `GET /api/users/:uid/available-concepts` - Next steps
- `GET /api/users/:uid/blocked-concepts` - Locked
- `GET /api/users/:uid/export` - Export JSON
- `POST /api/users/:uid/import` - Import JSON

---

## 🧪 Testing

### Load Sample Data
```bash
python examples/initialize_db.py
```

This creates:
- 9 Linear Algebra concepts
- 5 Calculus concepts
- Example user with progress
- Exported JSON file

### API Health Checks
```bash
curl http://localhost:3000/health    # Node.js
curl http://localhost:5000/health    # Flask
```

---

## 🌟 Key Features

✅ **Prerequisite Validation** - Enforce learning order
✅ **Dependency Trees** - Visualize skill hierarchy  
✅ **Progress Tracking** - Timestamped completions
✅ **JSON Export** - Backup & portability
✅ **Multi-Category** - Organize by domain
✅ **Difficulty Levels** - 1-10 scale
✅ **REST API** - 15 endpoints
✅ **MongoDB** - Scalable storage
✅ **Docker Ready** - Containerized deployment

---

## 🚢 Deployment Options

| Method | Setup Time | For |
|--------|-----------|-----|
| Docker Compose | 2 min | Local dev & testing |
| Manual | 5 min | Development |
| Production | 30 min | Scalable deployment |

---

## ❓ FAQ

**Q: How do I create a prerequisite chain?**
A: Create concepts with `prerequisites` array pointing to prerequisite concept IDs.

**Q: Can a user skip prerequisites?**
A: No - the system enforces prerequisites. Users can only access unlocked concepts.

**Q: How do I track user progress?**
A: Use `POST /api/users/:uid/skills/complete` to mark concepts done. Progress is timestamped.

**Q: Can I export user progress?**
A: Yes - `GET /api/users/:uid/export` creates a JSON file in `data/skill_trees/`.

**Q: How does the system scale?**
A: Flask and Node.js can run multiple workers. MongoDB can use replica sets. Add Redis for caching.

**Q: Is authentication included?**
A: No - framework assumes trusted environment. Add JWT/RBAC as needed.

---

## 📞 Troubleshooting

### MongoDB not running?
```bash
mongod
```

### Flask/Node ports in use?
```bash
# Change in .env files
FLASK port: 5000 → 5001
NODE port: 3000 → 3001
```

### Module not found?
```bash
# Flask
pip install -r flask-backend/requirements.txt

# Node.js
cd node-server && npm install
```

### API not responding?
```bash
# Check services are running
curl http://localhost:3000/health
curl http://localhost:5000/health
```

---

## 📚 Next Steps

1. **Read** [`QUICKSTART.md`](QUICKSTART.md) (5 min)
2. **Run** `docker-compose up` (2 min)
3. **Test** with sample curl commands (5 min)
4. **Load** sample data: `python examples/initialize_db.py`
5. **Explore** the API endpoints
6. **Customize** for your use case
7. **Read** [`ARCHITECTURE.md`](ARCHITECTURE.md) for deep dive

---

## 🎉 You're All Set!

Your skill tree backend is ready to go. Start with:

```bash
# Option 1: Docker (Easiest)
docker-compose up

# Option 2: Manual (Most Control)
# See QUICKSTART.md
```

Then visit **`http://localhost:3000`** or **`http://localhost:5000`**

**Questions?** Check the relevant doc file above or review the API examples in `EXAMPLES.json`

Happy hacking! 🚀
