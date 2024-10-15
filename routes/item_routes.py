from flask import Blueprint, jsonify, request
from mongo_models.item_model import get_all_items, add_item, update_item, delete_item

item_blueprint = Blueprint('items', __name__)

@item_blueprint.route('/api/requests', methods=['GET'])
def get_items():
    items = get_all_items()
    return jsonify(items)

@item_blueprint.route('/api/requests', methods=['POST'])
def create_item():
    data = request.json
    add_item(data)
    return jsonify({'msg': 'Request added successfully!'})

@item_blueprint.route('/api/requests/<id>', methods=['PUT'])
def modify_item(id):
    data = request.json
    update_item(id,data)
    return jsonify({'msg': 'Updated successfully!'})

@item_blueprint.route('/api/requests/<id>', methods=['DELETE'])
def remove_item(id):
    delete_item(id)
    return jsonify({'msg': 'Request deleted success!'})
