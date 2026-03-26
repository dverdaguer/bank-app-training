from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection string from environment
MONGO_URI = os.environ.get("MONGODB_URI")

client = MongoClient(MONGO_URI)
db = client.get_database("bankapp")