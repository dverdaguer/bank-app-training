from sqlalchemy import Column, Integer, String, DECIMAL, func, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
   __tablename__ = "users"

   user_id = Column(Integer, primary_key=True, index=True)
   name = Column(String(100))
   email = Column(String(100), unique=True)
   created_at = Column(DateTime, server_default=func.now())

class Account(Base):
   __tablename__ = "accounts"

   account_id = Column(Integer, primary_key=True, index=True)
   user_id = Column(Integer)
   balance = Column(DECIMAL(10,2), default=0)
   account_type = Column(String(50))
   created_at = Column(DateTime, server_default=func.now())

class Transaction(Base):
   __tablename__ = "transactions"

   txn_id = Column(Integer, primary_key=True, index=True)
   account_id = Column(Integer)
   txn_type = Column(String(20))
   amount = Column(DECIMAL(10,2))
   created_at = Column(DateTime, server_default=func.now())