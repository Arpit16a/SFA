from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
import cloudinary
import cloudinary.uploader
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.dbref import DBRef
from  config import Config
from datetime import datetime

request_orders = Blueprint('request_orders', __name__)

client = MongoClient(Config.MONGO_URI)
db = client.get_database('sfa')
orderAndRequestCollection = db['orderAndRequest']
productsCollection = db['products']
userCollection = db['admin']

@request_orders.route('/order_request', methods=['POST'])
def order_request():
    data = request.get_json()
    buyerId =data.get('buyerId')
    sellerId =data.get('sellerId')
    productId = data.get('productId')
    timestamp = datetime.utcnow().isoformat()


    orderAndRequestCollection.insert_one({'buyerId':str(buyerId), 'sellerId': str(sellerId), 'productId': str(productId), 'timestamp': timestamp, 'accepted': False })

    return jsonify({'message': 'order created successfully!'})

# get order 
@request_orders.route('/orders/<id>', methods=['GET'])
def getOrders(id):
    orderDetails = list(orderAndRequestCollection.find({'buyerId': id}).sort('timestamp', -1))

    # Create an empty list to hold product information with user details
    order_list = []

    for order in orderDetails:
        order['_id'] = str(order['_id'])

        product_details = productsCollection.find_one({'_id': ObjectId(order['productId'])})

        if product_details:
            product_info = {
                'id': str(product_details['_id']),
                'name': product_details['name'],
                'price': product_details['price'],
                'type': product_details['type'],
                'image_url': product_details['image_url'],
                'createdBy': product_details['createdBy'],
                "message": "Product found successfully!"
            }
        else:
            product_info = None 

        seller_details= userCollection.find_one({'_id': ObjectId(order['sellerId'])})

        if seller_details:
            # Merge user details into user_info
            seller_info = {
                'id': str(seller_details['_id']),
                'name': seller_details['name'],
                'username': seller_details['username'],
                'state': seller_details['state'],
                'contact': seller_details['contact'],
                'address': seller_details['address'],
                'type': seller_details['type'],
                "message": "Seller found successfully!"
            }
        else:
            seller_info = None 

        product_seller = {
            'product': product_info,
            'seller': seller_info
        }
        order_list.append(product_seller)
    res = {
        'orders': order_list
    }
    return jsonify(res)

# get request 
@request_orders.route('/requests/<id>', methods=['GET'])
def getRequests(id):

    requestDetails = list(orderAndRequestCollection.find({'sellerId': id}))

    request_list = []

    for request in requestDetails:
        request['_id'] = str(request['_id'])

        product_details = productsCollection.find_one({'_id': ObjectId(request['productId'])})

        if product_details:
            product_info = {
                'id': str(product_details['_id']),
                'name': product_details['name'],
                'price': product_details['price'],
                'type': product_details['type'],
                'image_url': product_details['image_url'],
                'createdBy': product_details['createdBy'],
                "message": "Product found successfully!"
            }
        else:
            product_info = None 

        buyer_details= userCollection.find_one({'_id': ObjectId(request['buyerId'])})

        if buyer_details:
            buyer_info = { 
                'id': str(buyer_details['_id']),
                'name': buyer_details['name'],
                'username': buyer_details['username'],
                'state': buyer_details['state'],
                'contact': buyer_details['contact'],
                'address': buyer_details['address'],
                'type': buyer_details['type'],
                "message": "Seller found successfully!"
            }
        else:
            buyer_info = None 

        product_seller = {
            'product': product_info,
            'buyer': buyer_info,
            'accepted': request['accepted'],
            'id': str(request['_id'])
        }
        request_list.append(product_seller)
    res = {
        'requests': request_list
    }
    return jsonify(res)

@request_orders.route('/order/accept', methods=['PUT'])
def accept_orders():
    data= request.json()
    id=data['id']

    orderAndRequestCollection.update_one({'_id': ObjectId(id)},{'$set': {'accepted': True}})
    return jsonify({'msg': 'Updated successfully!'})


