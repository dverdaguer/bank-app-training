from models import User, Account, Transaction
from database import SessionLocal
from sqlalchemy.exc import IntegrityError

def get_all_users():
   db = SessionLocal()
   users = db.query(User).all()
   db.close()
   return [user.__dict__ for user in users]

def get_user(user_id):
   db = SessionLocal()
   user = db.query(User).filter(User.user_id == user_id).first()
   db.close()
   return user.__dict__ if user else None

def create_user(name, email):
   db = SessionLocal()
   user = User(name=name, email=email)
   db.add(user)
   try:
      db.commit()
      db.refresh(user)
   except IntegrityError:
      db.rollback()
      db.close()
      raise ValueError('Email already exists')
   result = {'user_id': user.user_id, 'name': user.name, 'email': user.email}
   db.close()
   return result

def update_user(user_id, name, email):
   db = SessionLocal()
   user = db.query(User).filter(User.user_id == user_id).first()
   if not user:
      db.close()
      raise ValueError('User not found')
   user.name = name
   user.email = email
   db.commit()
   result = {'user_id': user.user_id, 'name': user.name, 'email': user.email}
   db.close()
   return result

def patch_user(user_id, name=None, email=None):
   db = SessionLocal()
   user = db.query(User).filter(User.user_id == user_id).first()
   if not user:
      db.close()
      raise ValueError('User not found')
   if name is not None:
      user.name = name
   if email is not None:
      user.email = email
   db.commit()
   result = {'user_id': user.user_id}
   if name is not None:
      result['name'] = name
   if email is not None:
      result['email'] = email
   db.close()
   return result

def delete_user(user_id):
   db = SessionLocal()
   user = db.query(User).filter(User.user_id == user_id).first()
   if not user:
      db.close()
      raise ValueError('User not found')
   db.delete(user)
   db.commit()
   db.close()
   return {'result': 'User deleted'}

def create_account(user_id, account_type):
   db = SessionLocal()
   account = Account(user_id=user_id, account_type=account_type)
   db.add(account)
   db.commit()
   db.refresh(account)
   result = {'accountId': account.account_id, 'userId': account.user_id, 'accountType': account.account_type}
   db.close()
   return result

def get_account(account_id):
   db = SessionLocal()
   account = db.query(Account).filter(Account.account_id == account_id).first()
   db.close()
   return account.__dict__ if account else None

def deposit_money(account_id, amount):
   if not amount or amount <= 0:
      raise ValueError('Amount must be positive')
   db = SessionLocal()
   account = db.query(Account).filter(Account.account_id == account_id).first()
   if not account:
      db.close()
      raise ValueError('Account not found')
   account.balance += amount
   txn = Transaction(account_id=account_id, txn_type='DEPOSIT', amount=amount)
   db.add(txn)
   db.commit()
   result = {'accountId': account_id, 'deposited': amount}
   db.close()
   return result

def withdraw_money(account_id, amount):
   if not amount or amount <= 0:
      raise ValueError('Amount must be positive')
   db = SessionLocal()
   account = db.query(Account).filter(Account.account_id == account_id).first()
   if not account:
      db.close()
      raise ValueError('Account not found')
   if account.balance < amount:
      db.close()
      raise ValueError('Insufficient funds')
   account.balance -= amount
   txn = Transaction(account_id=account_id, txn_type='WITHDRAW', amount=amount)
   db.add(txn)
   db.commit()
   result = {'accountId': account_id, 'withdrawn': amount}
   db.close()
   return result

def account_transactions(account_id):
   db = SessionLocal()
   txns = db.query(Transaction).filter(Transaction.account_id == account_id).order_by(Transaction.created_at.desc()).all()
   db.close()
   return [txn.__dict__ for txn in txns]