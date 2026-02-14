"""
Concept model for the dependency tree
"""
from mongoengine import Document, StringField, ListField, ReferenceField, IntField, DateTimeField, BooleanField
from datetime import datetime


class Concept(Document):
    """Represents a single concept node in the tree"""
    concept_id = StringField(required=True, unique=True)
    title = StringField(required=True)
    description = StringField()
    category = StringField()  # e.g., "Linear Algebra", "Calculus"
    difficulty_level = IntField(default=1)  # 1-10 scale
    prerequisites = ListField(ReferenceField('Concept'), default=[])
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    is_archived = BooleanField(default=False)
    
    meta = {
        'collection': 'concepts',
        'indexes': ['concept_id', 'title', 'category']
    }
    
    def to_dict(self, include_prerequisites=False):
        """Convert concept to dictionary"""
        data = {
            'concept_id': self.concept_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'difficulty_level': self.difficulty_level,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if include_prerequisites:
            data['prerequisites'] = [
                prereq.concept_id for prereq in self.prerequisites
            ]
        
        return data
    
    def get_dependency_chain(self, visited=None):
        """Get all transitive dependencies recursively"""
        if visited is None:
            visited = set()
        
        if self.concept_id in visited:
            return []
        
        visited.add(self.concept_id)
        chain = []
        
        for prereq in self.prerequisites:
            chain.append(prereq.concept_id)
            chain.extend(prereq.get_dependency_chain(visited))
        
        return list(set(chain))  # Remove duplicates
    
    def to_tree_dict(self):
        """Convert to tree structure with nested prerequisites"""
        return {
            'concept_id': self.concept_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'difficulty_level': self.difficulty_level,
            'prerequisites': [
                {
                    'concept_id': prereq.concept_id,
                    'title': prereq.title,
                } for prereq in self.prerequisites
            ]
        }
