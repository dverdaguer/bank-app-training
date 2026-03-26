USER_SCHEMA = {
   "name": str,
   "email": str,
   "password": str,
   "role": str,
   "created_at": "datetime (auto)"
}

ACCOUNT_SCHEMA = {
   "user_id": str,  # Reference to User _id
   "balance": float,
   "account_type": str,
   "created_at": "datetime (auto)"
}

TRANSACTION_SCHEMA = {
   "account_id": str,  # Reference to Account _id
   "txn_type": str,
   "amount": float,
   "created_at": "datetime (auto)"
}