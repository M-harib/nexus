"""
User model for tracking skill progress
"""
from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField, DictField, BooleanField
from datetime import datetime


class UserSkill(Document):
    """Tracks user progress on specific concepts"""
    user_id = StringField(required=True, unique=True)
    completed_concepts = ListField(ReferenceField('Concept'), default=[])
    in_progress_concepts = ListField(ReferenceField('Concept'), default=[])
    skill_tree_name = StringField()
    verified_skills = DictField(default={})  # Maps concept_id -> completion_date
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'user_skills',
        'indexes': ['user_id']
    }
    
    def mark_concept_completed(self, concept):
        """Mark a concept as completed"""
        if concept not in self.completed_concepts:
            self.completed_concepts.append(concept)
        if concept in self.in_progress_concepts:
            self.in_progress_concepts.remove(concept)
        
        self.verified_skills[concept.concept_id] = datetime.utcnow().isoformat()
        self.updated_at = datetime.utcnow()
        self.save()
    
    def mark_concept_in_progress(self, concept):
        """Mark a concept as being worked on"""
        if concept not in self.in_progress_concepts:
            self.in_progress_concepts.append(concept)
        self.updated_at = datetime.utcnow()
        self.save()
    
    def can_access_concept(self, concept):
        """Check if user has completed all prerequisites"""
        for prereq in concept.prerequisites:
            if prereq not in self.completed_concepts:
                return False
        return True
    
    def get_unlocked_concepts(self, all_concepts):
        """Get all concepts user can currently access"""
        unlocked = []
        for concept in all_concepts:
            if self.can_access_concept(concept):
                unlocked.append(concept)
        return unlocked
    
    def to_dict(self):
        """Convert to dictionary for JSON export"""
        return {
            'user_id': self.user_id,
            'skill_tree_name': self.skill_tree_name,
            'completed_concepts': [
                {
                    'concept_id': c.concept_id,
                    'title': c.title,
                    'completed_at': self.verified_skills.get(c.concept_id)
                }
                for c in self.completed_concepts
            ],
            'in_progress_concepts': [
                {
                    'concept_id': c.concept_id,
                    'title': c.title,
                }
                for c in self.in_progress_concepts
            ],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
