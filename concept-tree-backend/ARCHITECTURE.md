# Architecture & Design Documentation

## System Design

### High-Level Architecture

```
Client Layer
    ↓
[Node.js Server] (Port 3000) - API Gateway & Proxy
    ↓
[Flask Backend] (Port 5000) - Business Logic & Services
    ↓
[MongoDB] - Primary Data Store
+ 
[JSON Files] - User Skill Tree Backups
```

### Component Breakdown

#### 1. Node.js Server (Express)
**Role**: API Gateway and integration layer
- Exposes unified REST API on port 3000
- Proxies requests to Flask backend
- Provides routing and middleware
- Connection pooling to MongoDB
- Request logging and error handling

**Key Files**:
- `server.js`: Main Express application
- `flaskClient.js`: HTTP client for Flask API
- `routes/concepts.js`: Concept routing
- `routes/users.js`: User routing
- `db.js`: MongoDB connection manager

#### 2. Flask Backend (Python)
**Role**: Core business logic and database operations
- Runs on port 5000
- Direct MongoDB interface via MongoEngine ORM
- Service layer for complex operations
- RESTful API endpoints
- Handles all business logic validation

**Key Files**:
- `app.py`: Flask application setup
- `models/concept.py`: Concept data model
- `models/user.py`: UserSkill data model
- `services/concept_service.py`: Concept operations
- `services/user_service.py`: User operations

#### 3. MongoDB
**Role**: Primary persistent data store
- Stores all concepts and relationships
- Tracks user progress and completed skills
- Collections: `concepts`, `user_skills`

#### 4. JSON File Storage
**Role**: Independent backup and export system
- Located in `data/skill_trees/`
- One JSON file per user: `{user_id}_skill_tree.json`
- Format: User progress serialization with timestamps
- Enables data portability and backup

## Data Flow

### Creating a Concept Chain

```
1. User submits POST request (Node.js):
   POST /api/concepts
   {
     "concept_id": "matrix_mult",
     "title": "Matrix Multiplication",
     "prerequisites": ["basic_matrices"]
   }

2. Node.js proxies to Flask:
   POST http://localhost:5000/api/concepts

3. Flask validates and creates:
   a. Validates prerequisite exists
   b. Creates Concept object
   c. Saves to MongoDB
   d. Returns 201 with concept data

4. Response back through Node.js to client
```

### User Learning Path

```
1. User completes prerequisite:
   POST /api/users/{user_id}/skills/complete
   {"concept_id": "basic_matrices"}

2. Flask UserService:
   a. Retrieves user record
   b. Validates prerequisites ✓
   c. Adds to completed_concepts
   d. Records timestamp in verified_skills
   e. Saves updated user to MongoDB
   f. Calls UserService._save_user_to_json()

3. JSON Export:
   - Serializes user progress
   - Writes to data/skill_trees/{user_id}_skill_tree.json
   - Includes completion timestamps

4. User can now access dependent concepts:
   GET /api/users/{user_id}/available-concepts
   - Returns only unlocked concepts
```

## Database Schema

### Concepts Collection

```javascript
{
  _id: ObjectId,
  concept_id: string,          // Unique identifier
  title: string,
  description: string,
  category: string,
  difficulty_level: number,    // 1-10
  prerequisites: [ObjectId],   // References to Concept._id
  created_at: datetime,
  updated_at: datetime,
  is_archived: boolean
}

// Indexes
- concept_id (unique)
- category (for filtering)
```

### UserSkills Collection

```javascript
{
  _id: ObjectId,
  user_id: string,            // Unique identifier
  skill_tree_name: string,
  completed_concepts: [ObjectId],      // References to Concept._id
  in_progress_concepts: [ObjectId],    // References to Concept._id
  verified_skills: {
    "concept_id": "2024-01-15T10:30:00",  // Completion dates
    ...
  },
  created_at: datetime,
  updated_at: datetime
}

// Indexes
- user_id (unique)
```

### JSON Export Format

```json
{
  "user_id": "user123",
  "skill_tree_name": "mathematics",
  "completed_concepts": [
    {
      "concept_id": "matrices_intro",
      "title": "Introduction to Matrices",
      "completed_at": "2024-01-10T15:30:00"
    }
  ],
  "in_progress_concepts": [
    {
      "concept_id": "matrix_mult",
      "title": "Matrix Multiplication"
    }
  ],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-15T09:00:00",
  "exported_at": "2024-01-15T15:45:30"
}
```

## API Endpoint Categories

### Concept Management (8 endpoints)
- `POST /api/concepts` - Create
- `GET /api/concepts` - List
- `GET /api/concepts/:id` - Get one
- `PUT /api/concepts/:id` - Update
- `DELETE /api/concepts/:id` - Delete (soft)
- `GET /api/concepts/:id/dependencies` - Get prerequisite tree
- `GET /api/concepts/:id/dependents` - Get dependent concepts
- `GET /api/concepts/category/:cat/tree` - Get category graph

### User Skills Management (7 endpoints)
- `GET /api/users/:user_id/skills` - Get progress
- `POST /api/users/:user_id/skills/complete` - Mark completed
- `POST /api/users/:user_id/skills/start` - Mark in progress
- `GET /api/users/:user_id/available-concepts` - Get unlocked
- `GET /api/users/:user_id/blocked-concepts` - Get locked
- `GET /api/users/:user_id/export` - Export to JSON
- `POST /api/users/:user_id/import` - Import from JSON

## Validation Rules

### Concept Creation
1. `concept_id` must be unique
2. All prerequisites must exist in database
3. `difficulty_level` must be 1-10
4. No circular dependencies allowed (enforced via recursion detection)

### User Skill Progress
1. User cannot mark concept completed if prerequisites incomplete
2. User cannot start concept if prerequisites incomplete
3. User cannot access availability if prerequisites incomplete
4. Export includes only completed and in-progress concepts

## Scalability Considerations

### Current Architecture
- Single Flask process (can run in gunicorn with workers)
- Single Node.js process (can run with PM2/cluster mode)
- MongoDB handles concurrent connections

### Production Scaling
```
Load Balancer
    ↓
[Node.js Cluster] (multiple workers)
    ↓
[Flask Gunicorn] (multiple workers)
    ↓
[MongoDB Replica Set]
    +
[Redis Cache] (optional: for caching concept trees)
    +
[S3/Cloud Storage] (optional: for JSON backups)
```

## Error Handling

### Flask Error Responses
```json
400 Bad Request:
{
  "error": "Prerequisite concept {id} not found"
}

404 Not Found:
{
  "error": "Concept not found"
}

500 Internal Server Error:
{
  "error": str(exception)
}
```

### Node.js/Express Error Responses
```json
{
  "error": "Error message",
  "path": "/api/path",
  "status": 404
}
```

## Concurrency & Race Conditions

### Potential Issues
1. User completing prerequisites while another operation in flight
   - Mitigation: MongoDB transactions (if using v4+)
   - MongoDB handles atomic writes per document

2. Simultaneous skill tree exports
   - Mitigation: Each user gets independent file
   - File I/O is atomic at filesystem level

### Best Practices
- Use MongoDB _id references for consistency
- Rely on unique indexes for concept_id and user_id
- Timestamp all modifications
- Version exported JSON with creation timestamps

## Security Considerations

### Current Implementation
- No authentication/authorization (design assumes trusted environment)
- Input validation in Flask services
- MongoDB injection protection via MongoEngine ORM

### Production Hardening Needed
- JWT authentication on Node.js
- Role-based access control (RBAC)
- Input sanitization for all user inputs
- HTTPS/TLS for all communications
- MongoDB authentication and network isolation
- Rate limiting on API endpoints
- Audit logging for all modifications

## Deployment

### Development
```bash
# MongoDB
mongod

# Terminal 1: Flask
cd flask-backend
pip install -r requirements.txt
python app.py

# Terminal 2: Node.js
cd node-server
npm install
npm run dev
```

### Production (Example with Docker)
```dockerfile
FROM python:3.11
WORKDIR /app
COPY flask-backend .
RUN pip install -r requirements.txt
CMD gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### MongoDB Atlas (Cloud)
- Use connection string in MONGO_URI
- Enable IP whitelist
- Use connection pool
- Monitor with Atlas dashboards

## Performance Optimization

### Implemented
- Database indexing on frequently queried fields
- Efficient prerequisite chain traversal (recursive with caching)
- Soft deletes (is_archived flag) for faster operations

### Recommended Additions
- Query result caching (Redis)
- Pagination for large concept lists
- Lazy loading of prerequisite trees
- MongoDB aggregation pipeline for complex queries
- API response compression (gzip)

## Testing Strategy

### Unit Tests
- Test concept validation
- Test prerequisite chain logic
- Test permission checking

### Integration Tests
- Test API endpoints
- Test MongoDB persistence
- Test JSON export/import

### Load Tests
- Simulate 1000s of users
- Concurrent concept completion
- Large dependency trees

## Dependencies

### Flask Backend
```
flask==2.3.0
Flask-CORS==4.0.0
mongoengine==0.29.1
python-dotenv==1.0.0
```

### Node.js Server
```
express: 4.18.2
mongoose: 7.0.0
cors: 2.8.5
dotenv: 16.0.3
axios: 1.3.0
body-parser: 1.20.2
uuid: 9.0.0
```

## Future Enhancements

1. **Learning Analytics**
   - Track time spent on concepts
   - Difficulty heatmaps
   - Prerequisite recommendations

2. **Multimedia Integration**
   - Link resources (videos, PDFs)
   - Embedded quizzes
   - Progress check tests

3. **Social Features**
   - Progress sharing
   - Leaderboards
   - Study groups

4. **AI Integration**
   - Personalized learning paths
   - Prerequisite suggestions
   - Adaptive difficulty adjustment

5. **Mobile App**
   - Native iOS/Android clients
   - Offline support
   - Push notifications

---

**Version**: 1.0.0  
**Last Updated**: January 2024
