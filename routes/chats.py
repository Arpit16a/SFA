from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import jsonify,Blueprint,request
from  config import Config
from flask_socketio import SocketIO, emit, join_room, leave_room
from socketio_instance import socketio
from datetime import datetime

chats= Blueprint('chats', __name__)

client = MongoClient(Config.MONGO_URI)
db = client.get_database('sfa')
usersCollection = db['admin']
productsCollection = db['products']
chatsCollection = db['chats']

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('join_room')
def on_join(data):
    room= data['room']
    join_room(room)
    print(f'user joined the room: {room}')


@chats.route('/get_messages', methods=['GET'])
def get_messages():
    sender_id = request.args.get('sender_id')
    receiver_id =request.args.get('receiver_id')
    product_id = request.args.get('product_id')
    
    messages = chatsCollection.find({
        "$and": [
            {"$or": [
                {"sender_id": str(sender_id), "receiver_id": str(receiver_id)}, 
                {"receiver_id": str(receiver_id), "sender_id": str(sender_id)}
            ]},
            {"product_id": str(product_id)}]
    }).sort('timestamp')

    message_list = []
    for message in messages:
        message_list.append({
            "sender_id": message['sender_id'], 
            "reciever_id": message['reciever_id'], 
            "message": message['message'],
            "timestamp": message['timestamp'],
            "product_id": message['product_id']
        })
    return jsonify(message_list)

# @chats.route('/send_message', methods=['POST'])
# def send_message():
#     data = request.json
#     new_message = {
#         "sender_id": data['sender_id'],
#         "reciever_id": data['receiver_id'], 
#         "message": data['message'],
#         "product_id": data['product_id'],
#         "timestamp": datetime.now().isoformat(), 
#         "read": False
#     }

#     chatsCollection.insert_one(new_message)
#     socketio.on('send_message', new_message, room=data['room'])
#     return jsonify({"status": "message sent"})

@socketio.on('send_message')
def handle_message(data):
    room=data['room']
    message= data['message']
    sender=data['user']

    new_message = {
        **message,
        "timestamp": datetime.now().isoformat(), 
        "read": False
    }
    emit('recieve_message', {"message": message}, room=room)
    chatsCollection.insert_one(new_message)


@chats.route('/get_sellers/<buyer_id>', methods=['GET'])
def get_sellers(buyer_id):
    buyer_id = str(buyer_id)

    #fetch all buyeres
    sellers = chatsCollection.aggregate([
        {
            "$match": {"sender_id": buyer_id}
        },
        {
            "$group": {
                "_id": "$sender_id", 
                # group by buyer 
                "unread_count": {
                    "$sum": {"$cond": [{"$eq": ["$read", False]}, 1, 0]}
                }
            }
        }
    ])

    sellers_list = []
    for seller in sellers:
        sellers_list.append({
            "buyer_id": seller['_id'],
            "unread_count": seller['unread_count']
        })
    return jsonify(sellers_list)

@chats.route('/mark_as_read_buyer', methods=['POST'])
def mark_as_read_buyer():
    seller_id = request.json.get('seller_id')
    buyer_id = request.json.get('buyer_id')
    # update message from buyer to seller as read 
    chatsCollection.update_many({"sender_id": seller_id, "reciever_id": buyer_id, "read": False}, {"$set": {"read": True}})

    return jsonify({"status": "success"})



@chats.route('/get_buyers/<seller_id>', methods=['GET'])
def get_buyers(seller_id):
    seller_id = str(seller_id)

    #fetch all buyeres
    buyers = chatsCollection.find({"reciever_id": seller_id}).sort('timestamp', -1)

    buyers_list = []
    for buyer in buyers:
        product= productsCollection.find_one({"_id": ObjectId(buyer['product_id'])})
        product['_id'] = str(product['_id'])

        buyer_detail= usersCollection.find_one({'_id': ObjectId(buyer['sender_id'])})

        if buyer_detail:
            # Merge user details into user_info
            buyer_info = {
                'id': str(buyer_detail['_id']),
                'name': buyer_detail['name'],
                'username': buyer_detail['username'],
                'state': buyer_detail['state'],
                'contact': buyer_detail['contact'],
                'address': buyer_detail['address'],
                'type': buyer_detail['type'],
                "message": "Seller found successfully!"
            }
        else:
            buyer_info = None 

        buyers_list.append({
            "chatId": str(buyer['_id']),
            "sellerId": buyer['reciever_id'],
            "buyer" : buyer_info,
            "product": {**product},
            "read": buyer['read']
        })
    return jsonify(buyers_list)

@chats.route('/mark_as_read_seller', methods=['POST'])
def mark_as_read_seller():
    seller_id = request.json.get('seller_id')
    buyer_id = request.json.get('buyer_id')
    # update message from buyer to seller as read 
    chatsCollection.update_many({"sender_id": buyer_id, "reciever_id": seller_id, "read": False}, {"$set": {"read": True}})

    return jsonify({"status": "success"})


