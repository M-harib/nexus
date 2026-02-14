"""
Service for managing concepts and building dependency trees
"""
from models.concept import Concept
from typing import List, Dict, Optional


class ConceptService:
    """Handles concept CRUD operations and tree building"""
    
    @staticmethod
    def create_concept(concept_id: str, title: str, description: str = "", 
                      category: str = "", difficulty: int = 1, 
                      prerequisites: List[str] = None) -> Concept:
        """Create a new concept with optional prerequisites"""
        prereq_objects = []
        
        if prerequisites:
            for prereq_id in prerequisites:
                try:
                    prereq = Concept.objects.get(concept_id=prereq_id)
                    prereq_objects.append(prereq)
                except Concept.DoesNotExist:
                    raise ValueError(f"Prerequisite concept {prereq_id} not found")
        
        concept = Concept(
            concept_id=concept_id,
            title=title,
            description=description,
            category=category,
            difficulty_level=difficulty,
            prerequisites=prereq_objects
        )
        concept.save()
        return concept
    
    @staticmethod
    def get_concept(concept_id: str) -> Optional[Concept]:
        """Retrieve a concept by ID"""
        try:
            return Concept.objects.get(concept_id=concept_id)
        except Concept.DoesNotExist:
            return None
    
    @staticmethod
    def update_concept(concept_id: str, **kwargs) -> Optional[Concept]:
        """Update concept properties"""
        concept = ConceptService.get_concept(concept_id)
        if not concept:
            return None
        
        # Handle prerequisites separately
        if 'prerequisites' in kwargs:
            prereq_ids = kwargs.pop('prerequisites')
            prereq_objects = []
            for prereq_id in prereq_ids:
                try:
                    prereq = Concept.objects.get(concept_id=prereq_id)
                    prereq_objects.append(prereq)
                except Concept.DoesNotExist:
                    raise ValueError(f"Prerequisite concept {prereq_id} not found")
            concept.prerequisites = prereq_objects
        
        for key, value in kwargs.items():
            if hasattr(concept, key):
                setattr(concept, key, value)
        
        concept.save()
        return concept
    
    @staticmethod
    def delete_concept(concept_id: str) -> bool:
        """Delete a concept (soft delete by archiving)"""
        concept = ConceptService.get_concept(concept_id)
        if not concept:
            return False
        
        concept.is_archived = True
        concept.save()
        return True
    
    @staticmethod
    def get_all_concepts(category: str = None, include_archived: bool = False) -> List[Concept]:
        """Retrieve all concepts, optionally filtered by category"""
        query = Concept.objects(is_archived=include_archived)
        
        if category:
            query = query(category=category)
        
        return list(query)
    
    @staticmethod
    def get_dependent_concepts(concept_id: str) -> List[str]:
        """Get all concepts that depend on this one (reverse tree)"""
        concept = ConceptService.get_concept(concept_id)
        if not concept:
            return []
        
        dependents = Concept.objects(prerequisites__contains=concept)
        return [d.concept_id for d in dependents]
    
    @staticmethod
    def get_full_dependency_tree(concept_id: str) -> Dict:
        """Build complete dependency tree for a concept"""
        concept = ConceptService.get_concept(concept_id)
        if not concept:
            return {}
        
        def build_tree(c, visited=None):
            if visited is None:
                visited = set()
            
            if c.concept_id in visited:
                return None
            
            visited.add(c.concept_id)
            
            return {
                'concept_id': c.concept_id,
                'title': c.title,
                'difficulty_level': c.difficulty_level,
                'category': c.category,
                'prerequisites': [
                    build_tree(prereq, visited) for prereq in c.prerequisites
                ]
            }
        
        return build_tree(concept)
    
    @staticmethod
    def build_skill_tree_graph(category: str = None) -> Dict:
        """Build a complete graph of all concepts in a category"""
        concepts = ConceptService.get_all_concepts(category=category)
        
        return {
            'category': category or 'All',
            'total_concepts': len(concepts),
            'concepts': {
                c.concept_id: {
                    'title': c.title,
                    'description': c.description,
                    'difficulty_level': c.difficulty_level,
                    'prerequisites': [p.concept_id for p in c.prerequisites],
                    'dependents': ConceptService.get_dependent_concepts(c.concept_id)
                }
                for c in concepts
            }
        }
