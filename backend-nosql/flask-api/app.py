from flask import request, jsonify, Flask
from flask_cors import CORS
import repository
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://bank-app-training.vercel.app"}})

# JWT secret key from environment
JWT_SECRET = os.environ.get('JWT_SECRET', 'bankapp_secret')
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600

@app.route('/')
def index():
    return 'Bank App Initialized with MongoDB!'

@app.route('/users', methods=['GET'])
def get_users():
    users = repository.get_all_users()
    return jsonify(users)


@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = repository.get_user(user_id)
    if user:
        return jsonify(user)
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    if not name or not email or not password or not role:
        return jsonify({'error': 'Name, email, password, and role are required'}), 400
    try:
        user = repository.create_user(name, email, password, role)
        return jsonify(user), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 409

@app.route('/users/<user_id>', methods=['PUT'])
def update_user_route(user_id):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400
    try:
        user = repository.update_user(user_id, name, email, password)
        return jsonify(user)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404

@app.route('/users/<user_id>', methods=['PATCH'])
def patch_user_route(user_id):
    data = request.get_json()
    name = data.get('name') if 'name' in data else None
    email = data.get('email') if 'email' in data else None
    if name is None and email is None:
        return jsonify({'error': 'No fields to update'}), 400
    try:
        user = repository.patch_user(user_id, name, email)
        return jsonify(user)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404

@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user_route(user_id):
    try:
        result = repository.delete_user(user_id)
        return jsonify(result)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404


# Login Route
@app.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(f"Login attempt for email: {email}")  # Debug log
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    try:
        user = repository.login_user(email, password)
        payload = {
            'user_id': user['user_id'],
            'role': user['role'],
            'name': user['name'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return jsonify({'token': token, 'user': {'user_id': user['user_id'], 'role': user['role'], 'name': user['name']}}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 401

# Create Account
@app.route('/api/accounts', methods=['POST'])
def create_account_route():
    data = request.get_json()
    user_id = data.get('userId')
    account_type = data.get('accountType')
    email = data.get('email', None)
    if not user_id or not account_type:
        return jsonify({'error': 'userId and accountType are required'}), 400
    try:
        account = repository.create_account(user_id, account_type, email)
        return jsonify(account), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# Get all accounts for a user
@app.route('/api/users/<user_id>/accounts', methods=['GET'])
def get_user_accounts_route(user_id):
    accounts = repository.get_user_accounts(user_id)
    return jsonify(accounts)

# Get Account Details
@app.route('/api/accounts/<account_id>', methods=['GET'])
def get_account_route(account_id):
    account = repository.get_account(account_id)
    if account:
        return jsonify(account)
    else:
        return jsonify({'error': 'Account not found'}), 404

# Deposit Money
@app.route('/api/accounts/<account_id>/deposit', methods=['POST'])
def deposit_money_route(account_id):
    data = request.get_json()
    amount = data.get('amount')
    try:
        result = repository.deposit_money(account_id, amount)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

# Withdraw Money
@app.route('/api/accounts/<account_id>/withdraw', methods=['POST'])
def withdraw_money_route(account_id):
    data = request.get_json()
    amount = data.get('amount')
    try:
        result = repository.withdraw_money(account_id, amount)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

# Transaction History
@app.route('/api/accounts/<account_id>/transactions', methods=['GET'])
def account_transactions_route(account_id):
    txns = repository.account_transactions(account_id)
    return jsonify(txns)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)