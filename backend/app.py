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
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillsphere.db'
CORS(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
ma = Marshmallow(app)

migrate = Migrate(app, db)
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
            return jsonify({"token": token, "manager": True, "fName": manager_row[2]}), 200
        else:
            return jsonify({'message': 'incorrect password'}),403
    elif employee_row: #if the user is employee
        if bcrypt.check_password_hash(employee_row.hashed_password, password):
            token = create_token(employee_row.email)
            print("token "+token)
            return jsonify({"token": token, "manager": False, "fName": employee_row[2]}), 200
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
    

from backend.model.task import Task
from backend.model.subtask import Subtask
from backend.model.work_on import WorkOn

# Import necessary modules
from flask import jsonify, request
from backend.model.task import Task
from backend.model.employee import Employee

# Route for viewing tasks and employee progress
@app.route('/tasks', methods=['GET'])
def view_tasks():
    try:
        tasks = Task.query.all()
        task_list = []
        for task in tasks:
            task_info = {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'deadline': task.deadline.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                'employees': []  # Initialize an empty list to store employees
            }
            # Fetch employees assigned to the current task
            employees =db.session.execute(text("select e.email, e.first_name from employee as e join work_on w on e.email = w.employee_email join subtask s ON w.subtask_id = s.id where task_id='"+  str(task.id) +"'"))
            for employee in employees:
                task_info['employees'].append({
                    'email': employee.email,
                    'name': employee.first_name,
                    
                })
            task_list.append(task_info)
        return jsonify(task_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    try:
        task = Task.query.get(task_id)
        if task:
            task_info = {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'deadline': task.deadline.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                'employees': []  # Initialize an empty list to store employees
            }
            # Fetch employees assigned to the task
            employees = db.session.execute(text("select distinct e.email,e.first_name from employee as e join work_on w on e.email = w.employee_email join subtask s ON w.subtask_id = s.id where task_id='"+  str(task.id) +"'"))
            unique_employees = set()  # Set to store unique email addresses
            for employee in employees:
                if employee.email not in unique_employees:
                    task_info['employees'].append({
                        'employee email': employee.email,
                        'name': employee.first_name
                    })
                    unique_employees.add(employee.email)
            return jsonify(task_info), 200
        else:
            return jsonify({'message': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500


#Create Task
@app.route('/tasks/create', methods=['POST'])
def create_task():
    title = request.json.get('title')
    description = request.json.get('description')
    deadline = request.json.get('deadline')

    if not title:
        return jsonify({'message': 'Title is required'}), 400

    try:
        task = Task(title=title, description=description)
        if deadline:
            task.deadline = datetime.datetime.strptime(deadline, "%Y-%m-%dT%H:%M:%S.%fZ")
        db.session.add(task)
        db.session.commit()
        return jsonify({'id': task.id, 'title': task.title, 'description': task.description, 'deadline': task.deadline}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/tasks/<int:task_id>/subtasks/create', methods=['POST'])
def create_subtask(task_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    hours = data.get('hours')
    deadline = data.get('deadline')
    employee = data.get('employee')

    if not title:
        return jsonify({'message': 'Title is required'}), 400

    try:
        # Create the subtask
        subtask = Subtask(
            title=title,
            task_id=task_id,
            description=description,
            hours=hours
        )
        if deadline:
            subtask.deadline = datetime.datetime.strptime(deadline, "%Y-%m-%dT%H:%M:%S.%fZ")
        db.session.add(subtask)
        db.session.commit()
        # Create the association between subtask and employee
       
        if employee:
            work_on = WorkOn(
                subtask_id=subtask.id,
                employee_email=employee
                  
            )
            db.session.add(work_on)
            db.session.commit()

        return jsonify({
            'id': subtask.id,
            'title': subtask.title,
            'description': subtask.description,
            'hours': subtask.hours,
            'deadline': subtask.deadline,
            'employee':work_on.employee_email
        }), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({'message': str(e)}), 500


@app.route('/tasks/<int:task_id>/subtasks/view', methods=['GET'])
def get_subtasks(task_id):
    try:
        subtasks = Subtask.query.filter_by(task_id=task_id).all()
        subtask_list = []
        for subtask in subtasks:
            subtask_info = {
                'id': subtask.id,
                'title': subtask.title,
                'description': subtask.description,
                'hours': subtask.hours,
                'deadline': subtask.deadline.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                'is_completed': subtask.is_completed,
                'employee': []  # Initialize an empty list to store employee info
            }
            # Fetch employee information for the current subtask
            employees = WorkOn.query.filter_by(subtask_id=subtask.id).all()
            for employee in employees:
                subtask_info['employee'].append({
                    'email': employee.employee_email,
                    'start_time': employee.start_time.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    'end_time': employee.end_time.strftime("%Y-%m-%dT%H:%M:%S.%fZ") if employee.end_time else None,
                    'is_completed': employee.is_completed
                })
            subtask_list.append(subtask_info)
        return jsonify(subtask_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


#New delete task
@app.route('/tasks/<int:task_id>/delete', methods=["DELETE"])
def delete_task(task_id):
    try:
        # Delete subtasks first
        Subtask.query.filter_by(task_id=task_id).delete()
        # Now delete the task
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return jsonify({'message': f'Task with id {task_id} and all related subtasks have been deleted successfully'}), 200
        else:
            return jsonify({'message': 'Task not found'}), 404
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': str(e)}), 500


#Delete Subtask
@app.route('/subtasks/<int:subtask_id>', methods=['DELETE'])
def delete_subtask(subtask_id):
    try:
        subtask = Subtask.query.get(subtask_id)
        if subtask is None:
            return jsonify({'message': 'Subtask not found'}), 404
        db.session.delete(subtask)
        db.session.commit()
        return jsonify({}), 204
    except Exception as e:
        return jsonify({'message': str(e)}), 500

#Assign Subtask to Employee
@app.route('/subtasks/<int:subtask_id>/assign', methods=['POST'])
def assign_subtask(subtask_id):
    employee_email = request.json.get('employee_email')

    try:
        employee = Employee.query.filter_by(email=employee_email).first()
        if employee is None:
            return jsonify({'message': 'Employee not found'}), 404
        subtask = Subtask.query.get(subtask_id)
        if subtask is None:
            return jsonify({'message': 'Subtask not found'}), 404
        work_on = WorkOn(subtask_id=subtask_id, employee_email=employee_email)
        db.session.add(work_on)
        db.session.commit()
        return jsonify({'message': 'Subtask assigned'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/tasks/<int:task_id>', methods=["PUT"])
def updateTask(task_id):
    try:
        title = request.json['title']
        description = request.json['description']
        if request.json.get('deadline') is not None:
            deadline = datetime.datetime.strptime(request.json['deadline'], "%Y-%m-%dT%H:%M:%S.%fZ")
            db.session.execute(text(f"UPDATE task set title = '{title}', description = '{description}', deadline = '{deadline}' where id = '{task_id}'" ))
            db.session.commit()
        else:
            db.session.execute(text(f"UPDATE task set title = '{title}', description = '{description}' where id = '{task_id}'" ))
            db.session.commit()
        return jsonify({'message': 'success'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': "invalid inputs"}), 400

@app.route('/subTask/<int:id>', methods=["PUT"])
def updateSubTask(id):
    try:
        title = request.json['title']
        description = request.json['description']
        hours = request.json['hours']
        if request.json.get('deadline') is not None:
            deadline = datetime.datetime.strptime(request.json['deadline'], "%Y-%m-%dT%H:%M:%S.%fZ")
            db.session.execute(text(f"UPDATE subtask set title = '{title}', description = '{description}', hours ='{hours}', deadline = '{deadline}' where id = '{id}'" ))
            db.session.commit()
        else:
            db.session.execute(text(f"UPDATE subtask set title = '{title}', description = '{description}', hours ='{hours}' where id = '{id}'" ))
            db.session.commit()
        return jsonify({'message': 'success'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': "invalid inputs"}), 400
    
@app.route('/subtask/<int:id>', methods=["DELETE"])
def delete_Subtask(id):
    try:
        db.session.execute(text("delete from subtask where id = '"+ str(id) +"'"))
        db.session.commit()
        return jsonify({'message': f'Sub-Task with id {id} deleted successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': str(e)}), 500

@app.route('/upcomingDeadlines', methods=["GET"])
def getUpcomingDeadlines():
    result = db.session.execute(text("select t.title, s.title, s.deadline from task as t join subtask as s on t.id=s.task_id ORDER BY ABS(julianday(s.deadline) - julianday('now')) asc limit 4;")).fetchall()
    return jsonify({"result": [list(row) for row in result]}), 200

@app.route('/progress/<int:id>', methods=["GET"])
def getTaskProgress(id):
    completedSubTaskHours = db.session.execute(text(f"select sum(s.hours) from (task as t join subtask as s on t.id = s.task_id) join work_on as w on w.subtask_id = s.id where t.id = {id} and w.is_completed = 1")).fetchone()[0]
    remainingSubTaskHours = db.session.execute(text(f"select sum(s.hours) from (task as t join subtask as s on t.id = s.task_id) join work_on as w on w.subtask_id = s.id where t.id = {id} and w.is_completed = 0")).fetchone()[0]
    employee_list = db.session.execute(text(f"select e.email, e.first_name, e.last_name from (employee as e join work_on as w on e.email = w.employee_email) join subtask as t on w.subtask_id = t.id where t.task_id = {id}")).fetchall()
    if completedSubTaskHours is None:
        completedSubTaskHours=0
    if remainingSubTaskHours is None:
        remainingSubTaskHours=0
    ans = {"totalCompletedHours": completedSubTaskHours, "totalRemainingHours": remainingSubTaskHours}
    employeesAssigned = {}
    for t in employee_list:
        email = t[0]
        completed_hours_result = db.session.execute(text(f"select sum(s.hours) from (task as t join subtask as s on t.id = s.task_id) join work_on as w on w.subtask_id = s.id where t.id = {id} and w.employee_email = '{email}' and w.is_completed = 1")).fetchone()
        remaining_hours_result = db.session.execute(text(f"select sum(s.hours) from (task as t join subtask as s on t.id = s.task_id) join work_on as w on w.subtask_id = s.id where t.id = {id} and w.employee_email = '{email}' and w.is_completed = 0")).fetchone()
        completed_subtasks_result = db.session.execute(text(f"select s.title, s.hours from (subtask as s join task as t on s.task_id = t.id) join work_on as w on w.subtask_id = s.id where w.employee_email = '{email}' and t.id = {id} and w.is_completed = 1")).fetchall()
        remaining_subtasks_result = db.session.execute(text(f"select s.title, s.hours from (subtask as s join task as t on s.task_id = t.id) join work_on as w on w.subtask_id = s.id where w.employee_email = '{email}' and t.id = {id} and w.is_completed = 0")).fetchall()
    
        # Process the results into a serializable format
        if completed_hours_result[0] is None:
            employee_completed_hours = 0
        else:
            employee_completed_hours = completed_hours_result[0]
        if remaining_hours_result[0] is None:
            employee_remaining_hours = 0
        else:
            employee_remaining_hours = remaining_hours_result[0]
        completed_subtask_list = [{"title": row[0], "hours": row[1]} for row in completed_subtasks_result]
        remaining_subtask_list = [{"title": row[0], "hours": row[1]} for row in remaining_subtasks_result]

        # Build the employee information
        employeesAssigned[email] = {
            "firstName": t[1],
            "lastName": t[2],
            "completedHours": employee_completed_hours,
            "remainingHours": employee_remaining_hours,
            "completedSubTasks": completed_subtask_list,
            "remainingSubTasks": remaining_subtask_list
        }
        
    ans["byEmployee"] = employeesAssigned
    return jsonify(ans), 200
