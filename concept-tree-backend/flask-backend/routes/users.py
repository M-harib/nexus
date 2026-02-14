"""
API routes for user skill management
"""
from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_routes = Blueprint('users', __name__, url_prefix='/api/users')


@user_routes.route('/<user_id>/skills', methods=['GET'])
def get_user_skills(user_id):
    """Get user's current skill progress"""
    progress = UserService.get_user_progress(user_id)
    return jsonify(progress), 200


@user_routes.route('/<user_id>/skills/complete', methods=['POST'])
def complete_concept(user_id):
    """Mark a concept as completed"""
    try:
        data = request.get_json()
        concept_id = data.get('concept_id')
        
        if not concept_id:
            return jsonify({'error': 'concept_id required'}), 400
        
        success = UserService.complete_concept(user_id, concept_id)
        
        if not success:
            return jsonify({
                'error': 'Cannot complete concept - prerequisites not met'
            }), 400
        
        return jsonify({
            'message': 'Concept marked as completed',
            'user_id': user_id,
            'concept_id': concept_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@user_routes.route('/<user_id>/skills/start', methods=['POST'])
def start_concept(user_id):
    """Mark a concept as in progress"""
    try:
        data = request.get_json()
        concept_id = data.get('concept_id')
        
        if not concept_id:
            return jsonify({'error': 'concept_id required'}), 400
        
        success = UserService.start_concept(user_id, concept_id)
        
        if not success:
            return jsonify({
                'error': 'Cannot start concept - prerequisites not met'
            }), 400
        
        return jsonify({
            'message': 'Concept marked as in progress',
            'user_id': user_id,
            'concept_id': concept_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@user_routes.route('/<user_id>/available-concepts', methods=['GET'])
def get_available_concepts(user_id):
    """Get concepts available for user to learn"""
    available = UserService.get_available_concepts(user_id)
    
    return jsonify({
        'user_id': user_id,
        'available_count': len(available),
        'concepts': available
    }), 200


@user_routes.route('/<user_id>/blocked-concepts', methods=['GET'])
def get_blocked_concepts(user_id):
    """Get concepts user cannot access yet"""
    blocked = UserService.get_blocked_concepts(user_id)
    
    return jsonify({
        'user_id': user_id,
        'blocked_count': len(blocked),
        'concepts': blocked
    }), 200


@user_routes.route('/<user_id>/export', methods=['GET'])
def export_skill_tree(user_id):
    """Export user's skill tree as JSON"""
    tree = UserService.export_user_skill_tree(user_id)
    
    if tree is None:
        return jsonify({'error': 'Unable to export skill tree'}), 500
    
    return jsonify(tree), 200


@user_routes.route('/<user_id>/import', methods=['POST'])
def import_skill_tree(user_id):
    """Import a skill tree for user"""
    try:
        data = request.get_json()
        
        success = UserService.import_user_skill_tree(user_id, data)
        
        if not success:
            return jsonify({'error': 'Unable to import skill tree'}), 400
        
        return jsonify({
            'message': 'Skill tree imported successfully',
            'user_id': user_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
