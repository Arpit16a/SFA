from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
import cloudinary
import cloudinary.uploader
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.dbref import DBRef
from  config import Config

products = Blueprint('products', __name__)

client = MongoClient(Config.MONGO_URI)
db = client.get_database('sfa')
collection = db['products']

userCollection = db['admin']

cloudinary.config(
    cloud_name = 'dmhz3xyci',
    api_key = '234951926578425',
    api_secret = 'RbnS2F5JqmW3A03meFXSZa6g93M'
)

@products.route('/products', methods=['POST'])
def create_product():
    product_name= request.form['name']
    product_price= request.form['price']
    product_unit = request.form['unitName']
    product_type = request.form['type']
    createdBy= request.form['id']
    product_image= request.files['image']

    # upload
    cloudinary_response = cloudinary.uploader.upload(product_image)

    # create product document
    new_product = {
        'name': product_name,
        'price': product_price,
        'unitName': product_unit,
        'type': product_type,
        'image_url': cloudinary_response['secure_url'],
        'createdBy': createdBy,
    }

    # insert products into mongodb
    collection.insert_one(new_product)

    return jsonify({'message': 'Product created'}), 201

# read products

@products.route('/products', methods=['GET'])
def get_products():
    products = list(collection.find().sort('_id', 1))
    # Create an empty list to hold product information with user details
    product_list = []

    for product in products:
        product['_id'] = str(product['_id'])
        
        # Find the user who created the product
        user = userCollection.find_one({'_id': ObjectId(product['createdBy'])})

        if user:
            # Merge user details into user_info
            user_info = {
                'id': str(user['_id']),
                'name': user['name'],
                'username': user['username'],
                'state': user['state'],
                'contact': user['contact'],
                'address': user['address'],
                'type': user['type'],
                "message": "User registered successfully!"
            }
        else:
            user_info = None 

        # Add user details to the product object
        product_with_user = {
            **product,
            'user': user_info
        }

        # Append the product with user details to the product list
        product_list.append(product_with_user)

    # Returning the array of products, each with its own user object
    res = {
        'products': product_list
    }

    return jsonify(res), 200

@products.route('/products/<id>', methods=['DELETE'])
def delete_product(id):
    product = collection.find_one({'_id': ObjectId(id)})
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    public_id = product['image_url'].split('/')[-1].split('.')[0]

    cloudinary.uploader.destroy(public_id)

    collection.delete_one({'_id': ObjectId(id)})

    return jsonify({'message': 'Product deleted'}), 200

# read products
@products.route('/product/<id>', methods=['GET'])
def get_product_specific(id):
    product = collection.find_one({"_id": ObjectId(id)})
    product['_id']= str(product['_id'])
    return jsonify(product), 200

