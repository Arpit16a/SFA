from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import jsonify
from  config import Config


client = MongoClient(Config.MONGO_URI)
db = client.get_database('sfa')
collection = db['requests']

def get_all_items():
    requests = []
    for doc in collection.find().sort('_id', -1):
        requests.append({
            'id': str(ObjectId(doc['_id'])),
            'partners': str(doc['partners']),
            'supply': str(doc['supply']),
            'state': str(doc['state']),
            'crop': str(doc['crop']),
            'date': str(doc['date']),
            'contact': str(doc['contact']),
        })
    return requests

def add_item(data):
    collection.insert_one(data)

def update_item(id, data):
    collection.update_one({'_id': ObjectId(id)}, {'$set':data})

def delete_item(id):
    collection.delete_one({'_id': ObjectId(id)})

def get_item_by_id(id):
    return collection.find_one({'_id': ObjectId(id)})
