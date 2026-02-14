# Quick Reference Guide

## Setup (First Time)

### 1. Install Dependencies

```bash
# Flask dependencies
cd concept-tree-backend/flask-backend
pip install -r requirements.txt

# Node.js dependencies
cd ../node-server
npm install
```

### 2. Start the Services

**Terminal 1: MongoDB**
```bash
mongod
```

**Terminal 2: Flask**
```bash
cd flask-backend
python app.py
```

**Terminal 3: Node.js**
```bash
cd node-server
npm run dev
```

Or use the startup scripts:
- Linux/Mac: `./start.sh`
- Windows: `start.bat`

## Basic Usage

### Create a Concept

```bash
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -d '{
    "concept_id": "matrices",
    "title": "Introduction to Matrices",
    "category": "Linear Algebra",
    "difficulty_level": 1
  }'
```

### Create Dependent Concept

```bash
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -d '{
    "concept_id": "matrix_mult",
    "title": "Matrix Multiplication",
    "category": "Linear Algebra",
    "difficulty_level": 2,
    "prerequisites": ["matrices"]
  }'
```

### Track User Progress

```bash
# Start learning
curl -X POST http://localhost:3000/api/users/user1/skills/start \
  -H "Content-Type: application/json" \
  -d '{"concept_id": "matrices"}'

# Complete concept
curl -X POST http://localhost:3000/api/users/user1/skills/complete \
  -H "Content-Type: application/json" \
  -d '{"concept_id": "matrices"}'

# Get available next steps
curl http://localhost:3000/api/users/user1/available-concepts

# Export progress
curl http://localhost:3000/api/users/user1/export > user1_skill_tree.json
```

## Project Structure

```
concept-tree-backend/
├── flask-backend/              # Python/Flask API
│   ├── app.py                  # Main application
│   ├── models/                 # Data models
│   ├── routes/                 # API endpoints
│   ├── services/               # Business logic
│   ├── requirements.txt        # Dependencies
│   └── .env                    # Configuration
│
├── node-server/                # Node.js/Express gateway
│   ├── src/
│   │   ├── server.js           # Main server
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routes
│   │   ├── db.js               # MongoDB connection
│   │   ├── logger.js           # Logging
│   │   └── flaskClient.js      # Flask HTTP client
│   ├── package.json            # Dependencies
│   └── .env                    # Configuration
│
├── data/
│   └── skill_trees/            # User JSON exports
│
├── examples/
│   ├── initialize_db.py        # Sample data loader
│   ├── EXAMPLES.json           # API examples
│   └── requirements.txt
│
├── README.md                   # Full documentation
├── ARCHITECTURE.md             # System design
└── QUICKSTART.md              # This file
```

## Common Patterns

### Pattern 1: Complete Learning Path

1. **Create prerequisites**
   ```bash
   POST /api/concepts (basic_theory)
   ```

2. **Create dependent**
   ```bash
   POST /api/concepts (advanced_theory, prerequisites: [basic_theory])
   ```

3. **User learns**
   ```bash
   POST /api/users/USER_ID/skills/complete (basic_theory)
   GET /api/users/USER_ID/available-concepts  # Now shows advanced_theory
   ```

### Pattern 2: Complex Chains

Multiple prerequisites:
```json
{
  "concept_id": "multivariable_calculus",
  "prerequisites": [
    "single_variable_calculus",
    "linear_algebra",
    "vector_spaces"
  ]
}
```

User must complete ALL prerequisites before accessing concept.

### Pattern 3: Deep Trees

```
Basic Linear Algebra
  → Matrix Operations
      → Eigenvalues
          → Diagonalization
              → Applications
```

Use `/api/concepts/{id}/dependencies` to see full chain.

### Pattern 4: Parallel Paths

```
                    ┌─ Calculus ─┐
Basic Math ●────────┤            ├─→ Multivariate
                    └─ Linear ───┘
                      Algebra
```

User can learn either Calculus OR Linear Algebra after Basic Math.

## API Cheat Sheet

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/concepts` | Create concept |
| GET | `/api/concepts` | List all |
| GET | `/api/concepts/:id` | Get one |
| PUT | `/api/concepts/:id` | Update |
| DELETE | `/api/concepts/:id` | Delete |
| GET | `/api/concepts/:id/dependencies` | See prerequisites |
| GET | `/api/concepts/:id/dependents` | See concepts that need this |
| GET | `/api/concepts/category/:cat/tree` | Get category graph |
| GET | `/api/users/:uid/skills` | Get user progress |
| POST | `/api/users/:uid/skills/start` | Start concept |
| POST | `/api/users/:uid/skills/complete` | Complete concept |
| GET | `/api/users/:uid/available-concepts` | Get unlocked concepts |
| GET | `/api/users/:uid/blocked-concepts` | Get locked concepts |
| GET | `/api/users/:uid/export` | Export to JSON |
| POST | `/api/users/:uid/import` | Import from JSON |

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh

# If not running on Mac:
brew services start mongodb-community

# If not running on Windows:
# Use MongoDB installer or services
```

### Flask Port Conflict
```bash
# Change port in flask-backend/app.py
app.run(port=5001)  # Or any available port

# Update node-server/.env
FLASK_API_URL=http://localhost:5001
```

### Node.js Port Conflict
```bash
# Find process on port 3000
lsof -i :3000  # Mac/Linux

# Change port in node-server/.env
PORT=3001

# Or kill process
kill -9 <PID>
```

### MongoDB Port Conflict
```bash
# MongoDB default: 27017
# Change in .env files
MONGO_URI=mongodb://localhost:27018/concept-tree
```

## Testing APIs with cURL

### Get Health Status
```bash
curl http://localhost:3000/health
curl http://localhost:5000/health
```

### Create Test Data
```bash
python examples/initialize_db.py
```

### Export Sample User Data
```bash
curl http://localhost:3000/api/users/example_user/export | jq .
```

## Environment Variables

### Flask (.env)
```
MONGO_URI=mongodb://localhost:27017/concept-tree
FLASK_ENV=development
FLASK_DEBUG=true
```

### Node.js (.env)
```
MONGO_URI=mongodb://localhost:27017/concept-tree
NODE_ENV=development
PORT=3000
FLASK_API_URL=http://localhost:5000
LOG_LEVEL=debug
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on endpoints | Check Flask/Node.js are running |
| Cannot create concept | Check MongoDB is running |
| Prerequisites not found | Verify prerequisite concept_id exists |
| User cannot complete | Verify prerequisites are completed first |
| JSON export empty | Export happens automatically, check data/skill_trees/ |
| Slow queries | Add MongoDB indexes (done automatically) |

## Next Steps

1. **Load Sample Data**: `python examples/initialize_db.py`
2. **Try API Endpoints**: Use examples in curl/Postman
3. **Read Full Docs**: See README.md and ARCHITECTURE.md
4. **Customize**: Modify models/services for your use case
5. **Deploy**: Use Docker for production setup

---

**For detailed API documentation**: Visit `http://localhost:5000` or `http://localhost:3000`
