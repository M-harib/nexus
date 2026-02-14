"""
Service for managing user skills and progress
"""
import json
import os
from datetime import datetime
from typing import List, Dict, Optional
from models.user import UserSkill
from models.concept import Concept


class UserService:
    """Handles user skill tracking and progression"""
    
    SKILL_TREES_DIR = os.path.join(os.path.dirname(__file__), '../../data/skill_trees')
    
    @staticmethod
    def get_or_create_user(user_id: str, skill_tree_name: str = "default") -> UserSkill:
        """Get existing user or create new one"""
        try:
            user = UserSkill.objects.get(user_id=user_id)
        except UserSkill.DoesNotExist:
            user = UserSkill(
                user_id=user_id,
                skill_tree_name=skill_tree_name
            )
            user.save()
        
        return user
    
    @staticmethod
    def complete_concept(user_id: str, concept_id: str) -> bool:
        """Mark a concept as completed for user"""
        user = UserService.get_or_create_user(user_id)
        concept = Concept.objects.get(concept_id=concept_id)
        
        if not user.can_access_concept(concept):
            return False
        
        user.mark_concept_completed(concept)
        UserService._save_user_to_json(user)
        return True
    
    @staticmethod
    def start_concept(user_id: str, concept_id: str) -> bool:
        """Mark a concept as in progress"""
        user = UserService.get_or_create_user(user_id)
        concept = Concept.objects.get(concept_id=concept_id)
        
        if not user.can_access_concept(concept):
            return False
        
        user.mark_concept_in_progress(concept)
        UserService._save_user_to_json(user)
        return True
    
    @staticmethod
    def get_user_progress(user_id: str) -> Dict:
        """Get detailed progress for a user"""
        user = UserService.get_or_create_user(user_id)
        
        return {
            'user_id': user.user_id,
            'skill_tree_name': user.skill_tree_name,
            'stats': {
                'completed': len(user.completed_concepts),
                'in_progress': len(user.in_progress_concepts),
                'progress_percentage': (
                    len(user.completed_concepts) /
                    (len(user.completed_concepts) + len(user.in_progress_concepts) + 1) * 100
                ) if user.completed_concepts else 0
            },
            'completed_concepts': [
                {
                    'concept_id': c.concept_id,
                    'title': c.title,
                    'category': c.category,
                    'completed_at': user.verified_skills.get(c.concept_id)
                }
                for c in user.completed_concepts
            ],
            'in_progress_concepts': [
                {
                    'concept_id': c.concept_id,
                    'title': c.title,
                    'category': c.category,
                }
                for c in user.in_progress_concepts
            ]
        }
    
    @staticmethod
    def get_available_concepts(user_id: str) -> List[Dict]:
        """Get concepts user can currently work on"""
        user = UserService.get_or_create_user(user_id)
        all_concepts = Concept.objects(is_archived=False)
        available = user.get_unlocked_concepts(all_concepts)
        
        return [
            {
                'concept_id': c.concept_id,
                'title': c.title,
                'description': c.description,
                'category': c.category,
                'difficulty_level': c.difficulty_level,
                'prerequisites': [p.concept_id for p in c.prerequisites]
            }
            for c in available if c not in user.completed_concepts
        ]
    
    @staticmethod
    def get_blocked_concepts(user_id: str) -> List[Dict]:
        """Get concepts user cannot access yet"""
        user = UserService.get_or_create_user(user_id)
        all_concepts = Concept.objects(is_archived=False)
        blocked = [
            c for c in all_concepts
            if not user.can_access_concept(c) and c not in user.completed_concepts
        ]
        
        return [
            {
                'concept_id': c.concept_id,
                'title': c.title,
                'description': c.description,
                'category': c.category,
                'difficulty_level': c.difficulty_level,
                'blocked_by': [
                    {
                        'concept_id': p.concept_id,
                        'title': p.title
                    }
                    for p in c.prerequisites
                    if p not in user.completed_concepts
                ]
            }
            for c in blocked
        ]
    
    @staticmethod
    def _save_user_to_json(user: UserSkill) -> None:
        """Export user skill tree to JSON file"""
        os.makedirs(UserService.SKILL_TREES_DIR, exist_ok=True)
        
        file_path = os.path.join(
            UserService.SKILL_TREES_DIR,
            f"{user.user_id}_skill_tree.json"
        )
        
        user_data = user.to_dict()
        user_data['exported_at'] = datetime.utcnow().isoformat()
        
        with open(file_path, 'w') as f:
            json.dump(user_data, f, indent=2)
    
    @staticmethod
    def export_user_skill_tree(user_id: str) -> Optional[Dict]:
        """Export user's complete skill tree"""
        user = UserService.get_or_create_user(user_id)
        UserService._save_user_to_json(user)
        
        file_path = os.path.join(
            UserService.SKILL_TREES_DIR,
            f"{user_id}_skill_tree.json"
        )
        
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                return json.load(f)
        
        return None
    
    @staticmethod
    def import_user_skill_tree(user_id: str, tree_data: Dict) -> bool:
        """Import a skill tree from JSON data"""
        try:
            user = UserService.get_or_create_user(user_id)
            
            # Clear existing skills
            user.completed_concepts = []
            user.in_progress_concepts = []
            user.verified_skills = {}
            
            # Import completed concepts
            if 'completed_concepts' in tree_data:
                for concept_data in tree_data['completed_concepts']:
                    concept = Concept.objects.get(
                        concept_id=concept_data['concept_id']
                    )
                    user.completed_concepts.append(concept)
                    if 'completed_at' in concept_data:
                        user.verified_skills[concept.concept_id] = concept_data['completed_at']
            
            user.save()
            UserService._save_user_to_json(user)
            return True
        except Exception as e:
            print(f"Error importing skill tree: {e}")
            return False
