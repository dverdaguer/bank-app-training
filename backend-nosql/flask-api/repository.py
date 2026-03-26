from database import db
import bcrypt
from bson.objectid import ObjectId
from datetime import datetime

def get_all_users():
   users = list(db["users"].find())
   for user in users:
      user["user_id"] = str(user["_id"])
      user.pop("_id", None)
      user.pop("password", None)
   return users

def get_user(user_id):
   user = db["users"].find_one({"_id": ObjectId(user_id)})
   if user:
      user["user_id"] = str(user["_id"])
      user.pop("_id", None)
      user.pop("password", None)
      return user
   return None

def create_user(name, email, password, role):
   if db["users"].find_one({"email": email}):
      raise ValueError('Email already exists')
   hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
   user_doc = {
      "name": name,
      "email": email,
      "password": hashed_pw.decode('utf-8'),
      "role": role,
      "created_at": datetime.utcnow()
   }
   result = db["users"].insert_one(user_doc)
   return {
      "user_id": str(result.inserted_id),
      "name": name,
      "email": email,
      "role": role
   }

def login_user(email, password):
   user = db["users"].find_one({"email": email})
   if user and bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
      return {
         "user_id": str(user["_id"]),
         "name": user["name"],
         "email": user["email"],
         "role": user["role"]
      }
   else:
      raise ValueError('Invalid email or password')

def update_user(user_id, name, email, password=None, role=None):
   update_fields = {"name": name, "email": email}
   if password:
      hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
      update_fields["password"] = hashed_pw.decode('utf-8')
   if role:
      update_fields["role"] = role
   result = db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
   if result.matched_count == 0:
      raise ValueError('User not found')
   return {"user_id": user_id, "name": name, "email": email, "role": role}

def patch_user(user_id, name=None, email=None, password=None, role=None):
   update_fields = {}
   if name is not None:
      update_fields["name"] = name
   if email is not None:
      update_fields["email"] = email
   if password is not None:
      hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
      update_fields["password"] = hashed_pw.decode('utf-8')
   if role is not None:
      update_fields["role"] = role
   result = db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
   if result.matched_count == 0:
      raise ValueError('User not found')
   response = {"user_id": user_id}
   if name is not None:
      response["name"] = name
   if email is not None:
      response["email"] = email
   if role is not None:
      response["role"] = role
   return response

def delete_user(user_id):
   result = db["users"].delete_one({"_id": ObjectId(user_id)})
   if result.deleted_count == 0:
      raise ValueError('User not found')
   return {"result": "User deleted"}

def create_account(user_id, account_type, email=None):
    if email:
        user = db["users"].find_one({"email": email})
        if not user:
            raise ValueError("No user found with the provided email")
        user_id = str(user["_id"])
    account_doc = {
        "user_id": user_id,
        "balance": 0.0,
        "account_type": account_type,
        "created_at": datetime.utcnow()
    }
    result = db["accounts"].insert_one(account_doc)
    return {
        "accountId": str(result.inserted_id),
        "userId": user_id,
        "accountType": account_type
    }

def get_user_accounts(user_id):
   accounts = list(db["accounts"].find({"user_id": user_id}))
   for account in accounts:
      account["accountId"] = str(account["_id"])
      account.pop("_id", None)
   return accounts

def get_account(account_id):
   account = db["accounts"].find_one({"_id": ObjectId(account_id)})
   if not account:
      return None
   user = db["users"].find_one({"_id": ObjectId(account["user_id"])})
   account_dict = account.copy()
   account_dict["accountId"] = str(account_dict.pop("_id"))
   account_dict["userName"] = user["name"] if user else None
   return account_dict

def deposit_money(account_id, amount):
   if not amount or amount <= 0:
      raise ValueError('Amount must be positive')
   result = db["accounts"].update_one({"_id": ObjectId(account_id)}, {"$inc": {"balance": amount}})
   if result.matched_count == 0:
      raise ValueError('Account not found')
   txn_doc = {
      "account_id": account_id,
      "txn_type": "DEPOSIT",
      "amount": amount,
      "created_at": datetime.utcnow()
   }
   db["transactions"].insert_one(txn_doc)
   return {"accountId": account_id, "deposited": amount}

def withdraw_money(account_id, amount):
   if not amount or amount <= 0:
      raise ValueError('Amount must be positive')
   account = db["accounts"].find_one({"_id": ObjectId(account_id)})
   if not account:
      raise ValueError('Account not found')
   if account["balance"] < amount:
      raise ValueError('Insufficient funds')
   db["accounts"].update_one({"_id": ObjectId(account_id)}, {"$inc": {"balance": -amount}})
   txn_doc = {
      "account_id": account_id,
      "txn_type": "WITHDRAW",
      "amount": amount,
      "created_at": datetime.utcnow()
   }
   db["transactions"].insert_one(txn_doc)
   return {"accountId": account_id, "withdrawn": amount}

def account_transactions(account_id):
   txns = list(db["transactions"].find({"account_id": account_id}).sort("created_at", -1))
   for txn in txns:
      txn["txn_id"] = str(txn["_id"])
      txn.pop("_id", None)
   return txns