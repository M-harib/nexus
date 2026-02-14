# Concept Dependency Tree Backend

A comprehensive framework for managing concept hierarchies and skill trees using Flask, Node.js, and MongoDB. This system tracks prerequisite relationships between concepts and manages user progress through structured learning paths.

## Architecture

```
┌─────────────────┐
│   Node.js       │ (Port 3000)
│   Server        │ - API Gateway
│                 │ - Route Proxying
├─────────────────┤
│   Flask         │ (Port 5000)
│   Backend       │ - Business Logic
│                 │ - Service Layer
├─────────────────┤
│   MongoDB       │
│   Database      │ - Concepts
│                 │ - User Skills
├─────────────────┤
│   JSON Files    │
│   Storage       │ - Skill Trees (Independent backups)
└─────────────────┘
```

## Features

- **Concept Management**: Create, update, and organize concepts with difficulty levels and categories
- **Dependency Trees**: Define prerequisite relationships between concepts (e.g., Matrix Multiplication → Matrix Transformations)
- **Skill Tracking**: Monitor user progress through completed and in-progress concepts
- **Prerequisite Validation**: Ensure users complete prerequisites before accessing advanced concepts
- **JSON Export/Import**: Export user skill trees to independent JSON files for backup and migration
- **Reverse Dependencies**: Query concepts that depend on a given concept

## Quick Start

### Prerequisites

- Python 3.7+
- Node.js 14+
- MongoDB 4.4+

### Installation

1. **Clone/Setup the repository**
```bash
cd concept-tree-backend
```

2. **Setup Flask Backend**
```bash
cd flask-backend
pip install -r requirements.txt
```

3. **Setup Node.js Server**
```bash
cd ../node-server
npm install
```

### Configuration

Update environment variables in `.env` files:

**Flask Backend** (`flask-backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/concept-tree
FLASK_ENV=development
FLASK_DEBUG=true
```

**Node.js Server** (`node-server/.env`):
```env
MONGO_URI=mongodb://localhost:27017/concept-tree
NODE_ENV=development
PORT=3000
FLASK_API_URL=http://localhost:5000
LOG_LEVEL=debug
```

### Running the Services

**Terminal 1 - Flask Backend**:
```bash
cd flask-backend
python app.py
```

**Terminal 2 - Node.js Server**:
```bash
cd node-server
npm run dev
```

**Terminal 3 - MongoDB**:
```bash
mongod
```

## API Endpoints

### Concept Management

#### Create Concept
```http
POST /api/concepts
Content-Type: application/json

{
  "concept_id": "matrix_mult",
  "title": "Matrix Multiplication",
  "description": "Learn how to multiply matrices",
  "category": "Linear Algebra",
  "difficulty_level": 3,
  "prerequisites": []
}
```

#### Get Concept
```http
GET /api/concepts/matrix_mult
```

#### List All Concepts
```http
GET /api/concepts
GET /api/concepts?category=Linear%20Algebra
```

#### Update Concept
```http
PUT /api/concepts/matrix_mult
Content-Type: application/json

{
  "title": "Matrix Multiplication (Advanced)",
  "difficulty_level": 4
}
```

#### Delete Concept (Soft Delete)
```http
DELETE /api/concepts/matrix_mult
```

#### Get Dependency Tree
```http
GET /api/concepts/matrix_transform/dependencies
```

Returns all prerequisites recursively for a concept.

#### Get Dependents
```http
GET /api/concepts/matrix_mult/dependents
```

Returns all concepts that depend on this one.

#### Get Category Skill Tree
```http
GET /api/concepts/category/Linear%20Algebra/tree
```

Returns complete graph of all concepts in a category.

### User Skills Management

#### Get User Progress
```http
GET /api/users/user123/skills
```

Response:
```json
{
  "user_id": "user123",
  "skill_tree_name": "default",
  "stats": {
    "completed": 5,
    "in_progress": 2,
    "progress_percentage": 70.0
  },
  "completed_concepts": [...],
  "in_progress_concepts": [...]
}
```

#### Start Learning a Concept
```http
POST /api/users/user123/skills/start
Content-Type: application/json

{
  "concept_id": "matrix_mult"
}
```

#### Complete a Concept
```http
POST /api/users/user123/skills/complete
Content-Type: application/json

{
  "concept_id": "matrix_mult"
}
```

#### Get Available Concepts
```http
GET /api/users/user123/available-concepts
```

Returns concepts the user can currently access (prerequisites met).

#### Get Blocked Concepts
```http
GET /api/users/user123/blocked-concepts
```

Returns concepts locked by unmet prerequisites, including what's blocking them.

#### Export Skill Tree
```http
GET /api/users/user123/export
```

Exports the skill tree to JSON file in `data/skill_trees/user123_skill_tree.json`

#### Import Skill Tree
```http
POST /api/users/user123/import
Content-Type: application/json

{
  "completed_concepts": [
    {
      "concept_id": "matrix_mult",
      "title": "Matrix Multiplication",
      "completed_at": "2024-01-15T10:30:00"
    }
  ],
  "in_progress_concepts": []
}
```

## Data Models

### Concept
```python
{
  "concept_id": "matrix_mult",
  "title": "Matrix Multiplication",
  "description": "Learn how to multiply matrices",
  "category": "Linear Algebra",
  "difficulty_level": 3,  # 1-10 scale
  "prerequisites": ["basic_matrices"],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "is_archived": false
}
```

### UserSkill
```python
{
  "user_id": "user123",
  "skill_tree_name": "mathematics",
  "completed_concepts": ["basic_matrices", "matrix_mult"],
  "in_progress_concepts": ["matrix_transform"],
  "verified_skills": {
    "basic_matrices": "2024-01-10T15:30:00",
    "matrix_mult": "2024-01-12T14:20:00"
  },
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-15T09:00:00"
}
```

## Example: Linear Algebra Skill Tree

```bash
# Create base concepts
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -d '{
    "concept_id": "basic_matrices",
    "title": "Introduction to Matrices",
    "category": "Linear Algebra",
    "difficulty_level": 1
  }'

# Create dependent concept
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -d '{
    "concept_id": "matrix_mult",
    "title": "Matrix Multiplication",
    "category": "Linear Algebra",
    "difficulty_level": 3,
    "prerequisites": ["basic_matrices"]
  }'

# Create another dependent
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -d '{
    "concept_id": "matrix_transform",
    "title": "Matrix Transformations",
    "category": "Linear Algebra",
    "difficulty_level": 4,
    "prerequisites": ["basic_matrices", "matrix_mult"]
  }'

# Track user progress
curl -X POST http://localhost:3000/api/users/student1/skills/start \
  -H "Content-Type: application/json" \
  -d '{"concept_id": "basic_matrices"}'

curl -X POST http://localhost:3000/api/users/student1/skills/complete \
  -H "Content-Type: application/json" \
  -d '{"concept_id": "basic_matrices"}'

# Check available concepts (now can access matrix_mult)
curl http://localhost:3000/api/users/student1/available-concepts

# Export skill tree
curl http://localhost:3000/api/users/student1/export > student1_backup.json
```

## Project Structure

```
concept-tree-backend/
├── flask-backend/
│   ├── models/
│   │   ├── concept.py        # Concept model
│   │   ├── user.py           # UserSkill model
│   │   └── __init__.py
│   ├── routes/
│   │   ├── concepts.py       # Concept API endpoints
│   │   ├── users.py          # User API endpoints
│   │   └── __init__.py
│   ├── services/
│   │   ├── concept_service.py # Business logic for concepts
│   │   ├── user_service.py   # Business logic for users
│   │   └── __init__.py
│   ├── app.py                # Main Flask application
│   ├── requirements.txt
│   └── .env
├── node-server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Concept.js    # MongoDB schema (Mongoose)
│   │   │   └── UserSkill.js
│   │   ├── routes/
│   │   │   ├── concepts.js   # Route proxies
│   │   │   └── users.js
│   │   ├── db.js             # MongoDB connection
│   │   ├── logger.js         # Logging utility
│   │   ├── flaskClient.js    # Flask API client
│   │   └── server.js         # Main Express server
│   ├── package.json
│   └── .env
├── data/
│   └── skill_trees/          # JSON storage for user trees
├── README.md
└── ARCHITECTURE.md
```

## Workflow Example

1. **Initialize Concepts**: Create a concept hierarchy in MongoDB
2. **User Registration**: System creates UserSkill record for new user
3. **Learn & Progress**: User completes concepts sequentially
4. **Prerequisite Validation**: System enforces learning order
5. **Export Backup**: User can export progress as JSON file
6. **Portability**: JSON files can be shared or imported to other accounts

## Integration Notes

- **Flask**: Handles core business logic and data models
- **Node.js**: Acts as API gateway and proxy layer, providing additional routing flexibility
- **MongoDB**: Persistent storage of concepts and user progress
- **JSON Files**: Independent backups of skill trees for each user
- Both services can be scaled independently

## Development

To extend the framework:

1. **Add new concepts**: Use POST `/api/concepts`
2. **Add business logic**: Extend `ConceptService` or `UserService`
3. **Add routes**: Create new route files in respective `routes/` directories
4. **Add models**: Extend MongoDB schema in Flask/Node.js models

## License

MIT

## Support

For issues or questions, refer to the API documentation at `/` endpoint when servers are running.
