#!/usr/bin/env python3
"""
Example script to initialize the database with sample concepts
Run this after starting the Flask server
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000"

# Sample concept hierarchy for Linear Algebra
sample_concepts = [
    {
        "concept_id": "basic_vectors",
        "title": "Basic Vectors",
        "description": "Introduction to vectors and vector notation",
        "category": "Linear Algebra",
        "difficulty_level": 1,
        "prerequisites": []
    },
    {
        "concept_id": "vector_operations",
        "title": "Vector Operations",
        "description": "Dot product, cross product, and vector norms",
        "category": "Linear Algebra",
        "difficulty_level": 2,
        "prerequisites": ["basic_vectors"]
    },
    {
        "concept_id": "matrices_intro",
        "title": "Introduction to Matrices",
        "description": "Matrix notation and basic matrix operations",
        "category": "Linear Algebra",
        "difficulty_level": 2,
        "prerequisites": []
    },
    {
        "concept_id": "matrix_multiplication",
        "title": "Matrix Multiplication",
        "description": "Understanding matrix multiplication rules",
        "category": "Linear Algebra",
        "difficulty_level": 3,
        "prerequisites": ["matrices_intro"]
    },
    {
        "concept_id": "matrix_transformations",
        "title": "Matrix Transformations",
        "description": "Using matrices to represent linear transformations",
        "category": "Linear Algebra",
        "difficulty_level": 4,
        "prerequisites": ["matrix_multiplication", "vector_operations"]
    },
    {
        "concept_id": "eigenvalues",
        "title": "Eigenvalues and Eigenvectors",
        "description": "Finding and understanding eigenvalues",
        "category": "Linear Algebra",
        "difficulty_level": 4,
        "prerequisites": ["matrix_transformations"]
    },
    {
        "concept_id": "linear_systems",
        "title": "Solving Linear Systems",
        "description": "Gaussian elimination and solving Ax=b",
        "category": "Linear Algebra",
        "difficulty_level": 3,
        "prerequisites": ["matrices_intro"]
    },
    {
        "concept_id": "determinants",
        "title": "Determinants",
        "description": "Computing and interpreting determinants",
        "category": "Linear Algebra",
        "difficulty_level": 3,
        "prerequisites": ["matrices_intro"]
    },
    {
        "concept_id": "matrix_inverse",
        "title": "Matrix Inversion",
        "description": "Computing and applying matrix inverses",
        "category": "Linear Algebra",
        "difficulty_level": 4,
        "prerequisites": ["determinants", "linear_systems"]
    },
]

# Sample Calculus concepts
calculus_concepts = [
    {
        "concept_id": "limits",
        "title": "Understanding Limits",
        "description": "Limit definition and limit laws",
        "category": "Calculus",
        "difficulty_level": 1,
        "prerequisites": []
    },
    {
        "concept_id": "continuity",
        "title": "Continuity",
        "description": "Continuous functions and intermediate value theorem",
        "category": "Calculus",
        "difficulty_level": 2,
        "prerequisites": ["limits"]
    },
    {
        "concept_id": "derivatives",
        "title": "Derivatives",
        "description": "Derivative definition, rules, and applications",
        "category": "Calculus",
        "difficulty_level": 3,
        "prerequisites": ["limits", "continuity"]
    },
    {
        "concept_id": "integration",
        "title": "Integration",
        "description": "Antiderivatives, indefinite and definite integrals",
        "category": "Calculus",
        "difficulty_level": 3,
        "prerequisites": ["derivatives"]
    },
    {
        "concept_id": "applications_calculus",
        "title": "Applications of Calculus",
        "description": "Optimization, related rates, and area/volume",
        "category": "Calculus",
        "difficulty_level": 4,
        "prerequisites": ["derivatives", "integration"]
    },
]

def create_concepts():
    """Create all sample concepts"""
    all_concepts = sample_concepts + calculus_concepts
    
    print(f"\nCreating {len(all_concepts)} concepts...\n")
    
    created = 0
    errors = 0
    
    for concept in all_concepts:
        try:
            response = requests.post(
                f"{BASE_URL}/api/concepts",
                json=concept,
                timeout=5
            )
            
            if response.status_code == 201:
                print(f"✓ Created: {concept['title']}")
                created += 1
            else:
                print(f"✗ Failed: {concept['title']} - {response.text}")
                errors += 1
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Error creating {concept['title']}: {e}")
            errors += 1
    
    print(f"\n{'='*50}")
    print(f"Created: {created} | Errors: {errors}")
    print(f"{'='*50}\n")
    
    return created, errors


def track_user_progress():
    """Example of tracking user progress"""
    user_id = "example_user"
    
    print(f"\nTracking progress for user: {user_id}\n")
    
    # Start learning basic vectors
    print("Starting 'Basic Vectors'...")
    requests.post(
        f"{BASE_URL}/api/users/{user_id}/skills/start",
        json={"concept_id": "basic_vectors"},
        timeout=5
    )
    
    # Complete basic vectors
    print("Completing 'Basic Vectors'...")
    requests.post(
        f"{BASE_URL}/api/users/{user_id}/skills/complete",
        json={"concept_id": "basic_vectors"},
        timeout=5
    )
    
    # Get available concepts
    response = requests.get(
        f"{BASE_URL}/api/users/{user_id}/available-concepts",
        timeout=5
    )
    
    available = response.json().get('concepts', [])
    print(f"\nAvailable concepts: {len(available)}")
    for concept in available[:3]:
        print(f"  - {concept['title']}")
    
    # Get user progress
    response = requests.get(
        f"{BASE_URL}/api/users/{user_id}/skills",
        timeout=5
    )
    
    progress = response.json()
    print(f"\nUser Progress:")
    print(f"  Completed: {progress['stats']['completed']}")
    print(f"  In Progress: {progress['stats']['in_progress']}")
    print(f"  Progress: {progress['stats']['progress_percentage']:.1f}%")
    
    # Export skill tree
    response = requests.get(
        f"{BASE_URL}/api/users/{user_id}/export",
        timeout=5
    )
    
    if response.status_code == 200:
        filename = f"skill_tree_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(response.json(), f, indent=2)
        print(f"\n✓ Exported skill tree to: {filename}")


def display_tree_example():
    """Display skill tree for a category"""
    category = "Linear Algebra"
    
    print(f"\nFetching skill tree for: {category}\n")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/concepts/category/{category}/tree",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Category: {data['category']}")
            print(f"Total Concepts: {data['total_concepts']}\n")
            
            for concept_id, info in data['concepts'].items():
                prereqs = info.get('prerequisites', [])
                prereq_str = f" (requires: {', '.join(prereqs)})" if prereqs else ""
                print(f"  {info['title']}{prereq_str}")
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching tree: {e}")


if __name__ == "__main__":
    print("="*50)
    print("Concept Dependency Tree - Sample Initialization")
    print("="*50)
    
    try:
        # Test connection
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        if response.status_code != 200:
            print("\n✗ Flask server is not responding. Start it with: python app.py")
            exit(1)
        print("\n✓ Connected to Flask server")
    
    except requests.exceptions.RequestException:
        print("\n✗ Cannot connect to Flask server at {BASE_URL}")
        print("Start it with: cd flask-backend && python app.py")
        exit(1)
    
    # Create concepts
    created, errors = create_concepts()
    
    # Display tree example
    display_tree_example()
    
    # Track user progress
    track_user_progress()
    
    print("\n" + "="*50)
    print("✓ Sample initialization complete!")
    print("="*50)
    print("\nNext steps:")
    print("  1. Visit http://localhost:5000 for API docs")
    print("  2. Use http://localhost:3000 (Node.js proxy)")
    print("  3. Check data/skill_trees/ for exported JSON")
    print("="*50 + "\n")
