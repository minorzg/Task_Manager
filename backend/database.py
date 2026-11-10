from pymongo import MongoClient

MONGO_URL="mongodb://localhost:27017"
client= MongoClient(MONGO_URL)
db=client["task_manager"]
tasks_collection =db["tasks"]

"""try:
    client.admin.command("ping")
    print("MongoDB connected success")
except Exception as e :
    print("failed connection")"""
