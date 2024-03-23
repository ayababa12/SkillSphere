from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask import request
from flask import jsonify
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import datetime
import re
import jwt
from sqlalchemy import text


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillsphere.db'
CORS(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
ma = Marshmallow(app)


from backend.model.manager import Manager , manager_schema
from backend.model.employee import Employee , employee_schema, many_employees_schema

SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"

department_list=['Accounting', 'HR'] # !!!!!!! ATTENTION !!!!!!! PLACEHOLDER VALUES

def create_token(user_id): 
    payload = { 
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4), 
        'iat': datetime.datetime.utcnow(), 
        'sub': user_id 
    } 
    return jwt.encode( 
        payload, 
        SECRET_KEY, 
        algorithm='HS256' 
    ) 

def extract_auth_token(authenticated_request): 
    auth_header = authenticated_request.headers.get('Authorization') 
    if auth_header: 
        return auth_header.split(" ")[1] 
    else: 
        return None 
    
def decode_token(token): 
    payload = jwt.decode(token, SECRET_KEY, 'HS256') 
    return payload['sub'] 

def is_valid_email(email):
    # Regular expression for email validation
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@app.route('/createManager',methods=['POST'])
def createManager():
    if request.json["email"]=='' or request.json["password"]=='' or not is_valid_email(request.json["email"]):
        return jsonify({'message': 'bad email or password'}),400
    if request.json["first_name"]=='' or request.json["last_name"]=='':
        return jsonify({'message': 'enter your name!'}),400
    try:
        m= Manager(request.json["email"], request.json["password"], request.json["first_name"], request.json["last_name"]) 
        db.session.add(m) 
        db.session.commit()
        
    except:
        return jsonify({'message': 'email already exists'}),400
     
    return jsonify(manager_schema.dump(m)) , 201

@app.route('/createEmployee', methods=['POST'])
def createEmployee():
    if request.json["email"]=='' or request.json["password"]=='' or not is_valid_email(request.json["email"]):
        return jsonify({'message': 'bad email or password'}),400
    if request.json["first_name"]=='' or request.json["last_name"]=='':
        return jsonify({'message': 'enter a name!'}),400
    if request.json["gender"] not in ['Male', 'Female']:
        return jsonify({'message': 'select a gender'}),400
    if request.json["department"]=='':
        return jsonify({'message': 'select a department'}),400
    if request.json["date_of_birth"] is None:
        return jsonify({'message': 'select a date of birth'}),400
    try:
        e= Employee(request.json["email"], request.json["password"], request.json["first_name"], request.json["last_name"],request.json["department"], request.json['gender'], datetime.datetime.strptime(request.json['date_of_birth'], "%Y-%m-%dT%H:%M:%S.%fZ"))
        db.session.add(e) 
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({'message': 'email already exists'}),400
     
    return jsonify(employee_schema.dump(e)) , 201

@app.route('/authentication', methods=['POST'])
def authenticate():
    email = request.json['email']
    password = request.json['password']
    if email=="" or password=="" or type(email)!=str or type(password)!=str:
        return jsonify({'message': 'invalid credentials'}),400
    employee_row=db.session.execute(text(f"select * from employee where email = "+'"'+email+'"')).fetchone()
    manager_row=db.session.execute(text(f"select * from manager where email = "+'"'+email+'"')).fetchone()
    if manager_row: #if the user is a manager
        if bcrypt.check_password_hash(manager_row.hashed_password, password):
            token = create_token(manager_row.email)
            print("token "+token)
            return jsonify({"token": token, "manager": True}), 200
        else:
            return jsonify({'message': 'incorrect password'}),403
    elif employee_row: #if the user is employee
        if bcrypt.check_password_hash(employee_row.hashed_password, password):
            token = create_token(employee_row.email)
            print("token "+token)
            return jsonify({"token": token, "manager": False}), 200
        else: 
            return jsonify({'message': 'incorrect password'}),403
    else: #user is neither
        return jsonify({'message': 'invalid email'}),403
    
@app.route('/employees',methods=['GET'])
def getEmployees():
    all_employees=[]
    for dept in department_list:
        all_employees.extend(db.session.execute(text(f"select * from employee where department = "+'"'+dept+'"')).fetchall())
    print(all_employees)
    return jsonify(many_employees_schema.dump(all_employees)) , 200

@app.route('/employees/<email>', methods=["GET"])
def getEmployee(email):
    employee = db.session.execute(text("select * from employee where email = '"+email+"'")).fetchone()
    if employee:
        return jsonify(employee_schema.dump(employee)), 200
    else:
        return jsonify({'message': 'employee doesnt exist'}), 404

@app.route('/employees/<email>', methods=["PUT"])
def updateEmployee(email):
    
    try:
        first_name = request.json['first_name']
        last_name = request.json['last_name']
        department = request.json['department']
        gender = request.json['gender']
        print(first_name)
        if request.json.get('date_of_birth') is not None:
            date_of_birth = datetime.datetime.strptime(request.json['date_of_birth'], "%Y-%m-%dT%H:%M:%S.%fZ")
            db.session.execute(text(f"UPDATE employee set first_name = '{first_name}', last_name = '{last_name}', department = '{department}', gender = '{gender}', date_of_birth = '{date_of_birth}' where email = '{email}'" ))
            db.session.commit()
        else:
            print(first_name)
            db.session.execute(text(f"UPDATE employee set first_name = '{first_name}', last_name = '{last_name}', department = '{department}', gender = '{gender}' where email = '{email}'" ))
            db.session.commit()
        return jsonify({'message': 'success'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': "invalid inputs"}), 400
    
@app.route("/employees/<email>", methods = ["DELETE"])
def deleteEmployee(email):
    try:
        db.session.execute(text("delete from employee where email = '"+ email +"'"))
        db.session.commit()
        return jsonify({'message': f'Employee with email {email} deleted successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': "user not found"}), 404
