# 🧪 Testing Your Node.js Backend

Complete test scenarios to verify the Node.js backend is working correctly.

## 🚀 Getting Started

Before testing, make sure everything is running:

```bash
cd node-backend
npm install
npm start

# In another terminal, you should see:
# ✓ Connected to MongoDB
# 🚀 Concept Dependency Tree Backend (Node.js)
# 📍 Server running on http://localhost:5000
```

## ✅ Test 1: Health Check

The most basic test to verify the server is running.

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Concept Dependency Tree Backend (Node.js)",
  "version": "2.0.0",
  "environment": "development"
}
```

**What it tests:** Server is running and responding

## ✅ Test 2: Parser Status

Check if Gemini API is configured.

```bash
curl http://localhost:5000/api/parser/status
```

**Expected Response:**
```json
{
  "available_endpoints": [
    "POST /api/parser/parse",
    "GET /api/parser/validate/<category>",
    "GET /api/parser/examples",
    "POST /api/parser/infer-category"
  ],
  "gemini_api_configured": true,
  "status": "ready"
}
```

**What it tests:** Gemini API key is configured

## ✅ Test 3: Parse Calculus Curriculum

Parse a simple calculus curriculum.

```bash
curl -X POST http://localhost:5000/api/parser/parse \
  -H "Content-Type: application/json" \
  -d '{
    "text": "1. Limits and Continuity\n2. Derivatives\n3. Integration",
    "category": "Calculus"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "created_count": 5,
    "created_concepts": [
      {
        "concept_id": "limits_and_continuity",
        "title": "Limits and Continuity",
        "description": "...",
        "difficulty_level": 1,
        "prerequisites": []
      },
      {
        "concept_id": "derivatives",
        "title": "Derivatives",
        "difficulty_level": 2,
        "prerequisites": ["limits_and_continuity"]
      }
      // ... more concepts
    ],
    "relationships_count": 4,
    "interpolated_count": 2,
    "interpolated_concepts": ["Limits", "Continuity"],
    "category": "Calculus",
    "summary": "...",
    "learning_path": "..."
  }
}
```

**What it tests:**
- Gemini API integration
- Concept extraction
- Prerequisite interpolation
- Database creation

## ✅ Test 4: List All Concepts

Get all created concepts.

```bash
curl http://localhost:5000/api/concepts
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "concept_id": "limits_and_continuity",
      "title": "Limits and Continuity",
      "description": "...",
      "category": "Calculus",
      "difficulty_level": 1,
      "prerequisites": []
    },
    // ... more concepts
  ]
}
```

**What it tests:** Database queries work

## ✅ Test 5: Get Concept by ID

Retrieve a specific concept.

```bash
curl http://localhost:5000/api/concepts/derivatives
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "concept_id": "derivatives",
    "title": "Derivatives",
    "description": "...",
    "category": "Calculus",
    "difficulty_level": 2,
    "prerequisites": [
      {
        "concept_id": "limits_and_continuity",
        "title": "Limits and Continuity"
      }
    ]
  }
}
```

**What it tests:** Concept retrieval & population

## ✅ Test 6: Get Category Tree

Get the complete dependency tree for a category.

```bash
curl http://localhost:5000/api/concepts/category/Calculus/tree
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "category": "Calculus",
    "concept_count": 5,
    "concepts": [
      {
        "concept_id": "limits_and_continuity",
        "title": "Limits and Continuity",
        "difficulty_level": 1,
        "prerequisites": []
      },
      {
        "concept_id": "derivatives",
        "title": "Derivatives",
        "difficulty_level": 2,
        "prerequisites": [
          {
            "concept_id": "limits_and_continuity",
            "title": "Limits and Continuity"
          }
        ]
      }
      // ... more concepts with full hierarchy
    ]
  }
}
```

**What it tests:** Concept tree traversal

## ✅ Test 7: Get Learning Path

Get the learning path to reach a specific concept.

```bash
curl http://localhost:5000/api/concepts/derivatives/learning-path
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "concept_id": "derivatives",
    "learning_path": [
      {
        "concept_id": "limits_and_continuity",
        "title": "Limits and Continuity",
        "difficulty_level": 1
      },
      {
        "concept_id": "derivatives",
        "title": "Derivatives",
        "difficulty_level": 2
      }
    ]
  }
}
```

**What it tests:** Dependency chain traversal

## ✅ Test 8: Track User Progress

Mark a concept as completed.

```bash
curl -X POST http://localhost:5000/api/users/alice/skills/limits_and_continuity/complete
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": "alice",
    "concept": {
      "concept_id": "limits_and_continuity",
      "title": "Limits and Continuity"
    },
    "status": "completed",
    "completed_at": "2026-02-14T10:30:00.000Z"
  }
}
```

**What it tests:** User skill tracking

## ✅ Test 9: Get User Skill Tree

Retrieve all concepts with user progress.

```bash
curl http://localhost:5000/api/users/alice/skills
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": "alice",
    "total_concepts": 5,
    "completed": 1,
    "in_progress": 0,
    "concepts": [
      {
        "concept_id": "limits_and_continuity",
        "title": "Limits and Continuity",
        "user_status": "completed",
        "user_progress": 100
      },
      {
        "concept_id": "derivatives",
        "title": "Derivatives",
        "user_status": "notstarted",
        "user_progress": 0
      }
      // ... more concepts
    ]
  }
}
```

**What it tests:** Skill tree with progress

## ✅ Test 10: Get Available Concepts

Get concepts the user can learn next (prerequisites completed).

```bash
curl http://localhost:5000/api/users/alice/available
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "concept_id": "derivatives",
      "title": "Derivatives",
      "difficulty_level": 2,
      "category": "Calculus"
    }
    // ... more available concepts
  ]
}
```

**What it tests:** Prerequisite checking

## ✅ Test 11: Update Progress

Update progress on a concept (0-100).

```bash
curl -X PUT http://localhost:5000/api/users/alice/skills/derivatives/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": "alice",
    "concept_id": "derivatives",
    "progress": 50,
    "status": "learning"
  }
}
```

**What it tests:** Progress updating

## ✅ Test 12: User Statistics

Get learning statistics for a user.

```bash
curl http://localhost:5000/api/users/alice/statistics
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": "alice",
    "total_concepts": 5,
    "completed": 1,
    "in_progress": 1,
    "not_started": 3,
    "percent_complete": 20,
    "categories": {
      "Calculus": {
        "total": 5,
        "completed": 1,
        "in_progress": 1
      }
    }
  }
}
```

**What it tests:** Statistics calculation

## ✅ Test 13: Export Skill Tree

Export user's skill tree as JSON.

```bash
curl http://localhost:5000/api/users/alice/export
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": "alice",
    "export_date": "2026-02-14T10:30:00.000Z",
    "summary": {
      "total_concepts": 5,
      "completed": 1,
      "in_progress": 1,
      "not_started": 3,
      "percent_complete": 20
    },
    "skills": [
      {
        "concept_id": "limits_and_continuity",
        "title": "Limits and Continuity",
        "category": "Calculus",
        "difficulty_level": 1,
        "user_status": "completed",
        "user_progress": 100,
        "prerequisites": []
      }
      // ... more skills
    ]
  }
}
```

**What it tests:** JSON export

## ✅ Test 14: Search Concepts

Search for concepts by keyword.

```bash
curl "http://localhost:5000/api/concepts/search/derivative"
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "concept_id": "derivatives",
      "title": "Derivatives",
      "category": "Calculus"
    }
  ]
}
```

**What it tests:** Search functionality

## ✅ Test 15: Error Handling

Test error handling with invalid input.

```bash
# Missing required field
curl -X POST http://localhost:5000/api/parser/parse \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "error": "text field required"
}
```

**Response Code:** 400

**What it tests:** Error validation

## 📊 Test Results Template

Use this to track which tests pass:

```
✅ Test 1: Health Check
✅ Test 2: Parser Status
✅ Test 3: Parse Curriculum
✅ Test 4: List Concepts
✅ Test 5: Get Concept
✅ Test 6: Category Tree
✅ Test 7: Learning Path
✅ Test 8: Track Progress
✅ Test 9: Skill Tree
✅ Test 10: Available Concepts
✅ Test 11: Update Progress
✅ Test 12: Statistics
✅ Test 13: Export
✅ Test 14: Search
✅ Test 15: Error Handling

TOTAL: 15/15 ✅ PASS
```

## 🧪 Advanced Tests

### Test with Real Sample Files

Use the actual sample curriculum files from `examples/`:

```bash
TEXT=$(cat examples/sample_calculus_toc.txt)

curl -X POST http://localhost:5000/api/parser/parse \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$TEXT\", \"category\": \"Calculus\"}"
```

### Test with Multiple Users

```bash
# Alice completes a task
curl -X POST http://localhost:5000/api/users/alice/skills/limits_and_continuity/complete

# Bob does the same
curl -X POST http://localhost:5000/api/users/bob/skills/limits_and_continuity/complete

# Check both independently
curl http://localhost:5000/api/users/alice/statistics
curl http://localhost:5000/api/users/bob/statistics
```

### Test Data Persistence

1. Parse a curriculum
2. Stop the server (`Ctrl+C`)
3. Restart the server (`npm start`)
4. Query the concepts - they should still exist!

## 🐛 Debugging Tips

Enable full debug logging:

```bash
DEBUG=* npm start
```

This will show:
- Database queries
- API requests
- Service method calls
- Error stack traces

## 📋 Checklist

Make sure:
- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Gemini API key configured
- [ ] Server is running
- [ ] Port 5000 is available
- [ ] All 15 basic tests pass
- [ ] Can parse sample files
- [ ] Can track multiple users
- [ ] Data persists after restart

## ✨ You're All Set!

Once all tests pass, your backend is production-ready! 🎉

Any issues? Check the logs with `DEBUG=* npm start`

---

**Happy testing!** 🧪✅
