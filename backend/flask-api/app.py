from flask import request, jsonify, Flask
import repository


app = Flask(__name__)

@app.route('/')
def index():
    return 'Bank App Initialized with SQLAlchemy!'

@app.route('/users', methods=['GET'])
def get_users():
    users = repository.get_all_users()
    
    # Remove SQLAlchemy _sa_instance_state from dicts
    for user in users:
        user.pop('_sa_instance_state', None)
    return jsonify(users)



@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = repository.get_user(user_id)
    if user:
        user.pop('_sa_instance_state', None)
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

@app.route('/users/<int:user_id>', methods=['PUT'])
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

@app.route('/users/<int:user_id>', methods=['PATCH'])
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

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user_route(user_id):
    try:
        result = repository.delete_user(user_id)
        return jsonify(result)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404


if __name__ == '__main__':
	app.run(debug=True)

# Login Route
@app.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    try:
        user = repository.login_user(email, password)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 401

# Create Account
@app.route('/api/accounts', methods=['POST'])
def create_account_route():
    data = request.get_json()
    user_id = data.get('userId')
    account_type = data.get('accountType')
    if not user_id or not account_type:
        return jsonify({'error': 'userId and accountType are required'}), 400
    try:
        account = repository.create_account(user_id, account_type)
        return jsonify(account), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Get Account Details
@app.route('/api/accounts/<int:account_id>', methods=['GET'])
def get_account_route(account_id):
    account = repository.get_account(account_id)
    if account:
        account.pop('_sa_instance_state', None)
        return jsonify(account)
    else:
        return jsonify({'error': 'Account not found'}), 404

# Deposit Money
@app.route('/api/accounts/<int:account_id>/deposit', methods=['POST'])
def deposit_money_route(account_id):
    data = request.get_json()
    amount = data.get('amount')
    try:
        result = repository.deposit_money(account_id, amount)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

# Withdraw Money
@app.route('/api/accounts/<int:account_id>/withdraw', methods=['POST'])
def withdraw_money_route(account_id):
    data = request.get_json()
    amount = data.get('amount')
    try:
        result = repository.withdraw_money(account_id, amount)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

# Transaction History
@app.route('/api/accounts/<int:account_id>/transactions', methods=['GET'])
def account_transactions_route(account_id):
    txns = repository.account_transactions(account_id)
    for txn in txns:
        txn.pop('_sa_instance_state', None)
    return jsonify(txns)