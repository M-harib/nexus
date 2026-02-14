"""
API routes for concept management
"""
from flask import Blueprint, request, jsonify
from services.concept_service import ConceptService
from models.concept import Concept

concept_routes = Blueprint('concepts', __name__, url_prefix='/api/concepts')


@concept_routes.route('/', methods=['POST'])
def create_concept():
    """Create a new concept"""
    try:
        data = request.get_json()
        
        concept = ConceptService.create_concept(
            concept_id=data.get('concept_id'),
            title=data.get('title'),
            description=data.get('description', ''),
            category=data.get('category', ''),
            difficulty=data.get('difficulty_level', 1),
            prerequisites=data.get('prerequisites', [])
        )
        
        return jsonify(concept.to_dict(include_prerequisites=True)), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@concept_routes.route('/<concept_id>', methods=['GET'])
def get_concept(concept_id):
    """Retrieve a specific concept"""
    concept = ConceptService.get_concept(concept_id)
    
    if not concept:
        return jsonify({'error': 'Concept not found'}), 404
    
    return jsonify(concept.to_tree_dict()), 200


@concept_routes.route('/<concept_id>', methods=['PUT'])
def update_concept(concept_id):
    """Update a concept"""
    try:
        data = request.get_json()
        concept = ConceptService.update_concept(concept_id, **data)
        
        if not concept:
            return jsonify({'error': 'Concept not found'}), 404
        
        return jsonify(concept.to_dict(include_prerequisites=True)), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@concept_routes.route('/<concept_id>', methods=['DELETE'])
def delete_concept(concept_id):
    """Delete a concept (soft delete)"""
    if ConceptService.delete_concept(concept_id):
        return jsonify({'message': 'Concept archived'}), 200
    return jsonify({'error': 'Concept not found'}), 404


@concept_routes.route('/', methods=['GET'])
def list_concepts():
    """List all concepts, optionally filtered by category"""
    category = request.args.get('category')
    include_archived = request.args.get('include_archived', 'false').lower() == 'true'
    
    concepts = ConceptService.get_all_concepts(category=category, include_archived=include_archived)
    
    return jsonify({
        'total': len(concepts),
        'concepts': [c.to_dict(include_prerequisites=True) for c in concepts]
    }), 200


@concept_routes.route('/<concept_id>/dependencies', methods=['GET'])
def get_dependencies(concept_id):
    """Get full dependency tree for a concept"""
    tree = ConceptService.get_full_dependency_tree(concept_id)
    
    if not tree:
        return jsonify({'error': 'Concept not found'}), 404
    
    return jsonify(tree), 200


@concept_routes.route('/<concept_id>/dependents', methods=['GET'])
def get_dependents(concept_id):
    """Get all concepts that depend on this one"""
    concept = ConceptService.get_concept(concept_id)
    
    if not concept:
        return jsonify({'error': 'Concept not found'}), 404
    
    dependents = ConceptService.get_dependent_concepts(concept_id)
    
    return jsonify({
        'concept_id': concept_id,
        'title': concept.title,
        'dependent_concepts': dependents,
        'count': len(dependents)
    }), 200


@concept_routes.route('/category/<category>/tree', methods=['GET'])
def get_category_tree(category):
    """Get complete skill tree for a category"""
    tree = ConceptService.build_skill_tree_graph(category=category)
    
    return jsonify(tree), 200


@concept_routes.route('/category/<category>/all', methods=['GET'])
def get_category_concepts(category):
    """Get all concepts in a category"""
    concepts = ConceptService.get_all_concepts(category=category)
    
    return jsonify({
        'category': category,
        'total': len(concepts),
        'concepts': [c.to_dict(include_prerequisites=True) for c in concepts]
    }), 200
