from os import abort
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

department_list=['accounting', 'hr','sales', 'technical','support','management','IT', 'product_mng', 'marketing'] # !!!!!!! ATTENTION !!!!!!! PLACEHOLDER VALUES

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
            return jsonify({"token": token, "manager": True, "fName": manager_row.first_name}), 200
        else:
            return jsonify({'message': 'incorrect password'}),403
    elif employee_row: #if the user is employee
        if bcrypt.check_password_hash(employee_row.hashed_password, password):
            token = create_token(employee_row.email)
            print("token "+token)
            return jsonify({"token": token, "manager": False, "fName": employee_row.first_name}), 200
        else: 
            return jsonify({'message': 'incorrect password'}),403
    else: #user is neither
        return jsonify({'message': 'invalid email'}),403


from flask import jsonify



@app.route('/employees',methods=['GET'])
def getEmployees():
    query = request.args.get("query")
    all_employees = db.session.execute(text(f"select * from employee where LOWER(first_name) like LOWER('%{query}%') or LOWER(last_name) like LOWER('%{query}%') or LOWER(department) like LOWER('%{query}%') or LOWER(first_name || ' ' || last_name) LIKE LOWER('%{query}%') or LOWER(department || ' ' || first_name || ' ' || department || ' ' || last_name || ' ' || department) LIKE LOWER('%{query}%') "))
    
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



#Create task
@app.route('/tasks/create', methods=['POST'])
def create_task():
    try:
        title = request.json.get('title')
        description = request.json.get('description')
        deadline = request.json.get('deadline')

        if not title or not description or not deadline:
            return jsonify({'message': 'Title, description, and deadline are required'}), 400

        # Convert the deadline string to a datetime object
        try:
            deadline_datetime = datetime.datetime.strptime(deadline, "%Y-%m-%dT%H:%M:%S.%fZ")
        except ValueError:
            return jsonify({'message': 'Invalid date format for deadline'}), 400
        
        task = Task(title=title, description=description, deadline=deadline_datetime)
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'deadline': task.deadline.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        # Log the exception for server-side inspection
        print(str(e))
        return jsonify({'message': 'An error occurred while creating the task'}), 500


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
            task_deadline = db.session.execute(text(f"select deadline from task where id = {task_id}")).fetchone()[0]
            if task_deadline < deadline:
                return jsonify({"message": "subtask deadline must be before task deadline"}), 400
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
    is_manager = request.args.get("is_manager")
    if is_manager == "true":
        result = db.session.execute(text("select t.title, s.title, s.deadline from task as t join subtask as s on t.id=s.task_id ORDER BY ABS(julianday(s.deadline) - julianday('now')) asc limit 4;")).fetchall()
    else:
        result = db.session.execute(text(f"select t.title, s.title, s.deadline from (task as t join subtask as s on t.id=s.task_id) join work_on as w on w.subtask_id = s.id where employee_email = '{request.args.get('email')}' ORDER BY ABS(julianday(s.deadline) - julianday('now')) asc limit 4;"))
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

@app.route('/getEmployeeSubTasks/<email>', methods=["GET"])
def getEmployeeSubTasks(email):
    subtaskList = db.session.execute(text(f"select t.title as task_title, s.title as subtask_title, s.description, s.hours, s.deadline, w.is_completed, s.id from (task as t join subtask as s on t.id = s.task_id) join work_on as w on w.subtask_id = s.id where w.employee_email = '{email}'  order by s.deadline")).fetchall()
    
    subtask_dicts = []
    for row in subtaskList:
        subtask_dict = {
            "task_title": row[0],
            "subtask_title": row[1],
            "description": row[2],
            "hours": row[3],
            "deadline": row[4],
            "is_completed": row[5],
            "subtask_id": row[6]
        }
        subtask_dicts.append(subtask_dict)

    return jsonify(subtask_dicts), 200

@app.route('/markSubTaskAsComplete', methods=["PUT"])
def markSubTaskAsComplete():
    complete = int(request.json["complete"])
    subtask_id = int(request.json["subtask_id"])
    email = request.json["email"]
    print(complete, subtask_id, email)
    try:
        db.session.execute(text(f"update work_on set is_completed = {complete} where employee_email = '{email}' and subtask_id = {subtask_id}"))
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"message": e}), 400
    return jsonify({"message": "success"}), 201


from backend.model.survey import SurveyResult

@app.route('/submit-survey', methods=['POST'])
def submit_survey():
    try:
        data = request.json
        emp_email = db.session.execute(text("select employee_email from survey_result where employee_email = '"+data['employee_email']+"'")).fetchone()
        if emp_email is None: # if the employee's email is not in this table, we create an entry for them
            new_survey = SurveyResult(
                employee_email=data['employee_email'],  # Changed from employee_id to employee_email
                satisfaction_level=data['satisfaction_level'],
                num_projects=data['num_projects'],
                avg_monthly_hours=data['avg_monthly_hours'],
                years_at_company=data['years_at_company'],
                work_accident=bool(int(data['work_accident'])),  # Assuming you're passing '1' or '0'
                promotion_last_5years=bool(int(data['promotion_last_5years'])),  # Assuming '1' or '0'
                department=data['department'],
                salary=data['salary'],
                turnover_intent = None
            )
            db.session.add(new_survey)
        else:
            db.session.execute(text(f"update survey_result set satisfaction_level = {data['satisfaction_level']}, num_projects = {data['num_projects']}, avg_monthly_hours = {data['avg_monthly_hours']}, years_at_company = {data['years_at_company']}, work_accident = {bool(int(data['work_accident']))}, promotion_last_5years = {bool(int(data['promotion_last_5years']))}, department = '{data['department']}', salary = '{data['salary']}'"))
        db.session.commit()
        return jsonify({"message": "Survey submitted successfully"}), 201
    except Exception as e:
        db.session.rollback()  # Ensures that if an error occurs, no changes are made to the database
        print(e)
        return jsonify({'error': str(e)}), 500




from joblib import load
import pandas as pd

# Load the model
model = load('model/employee_turnover_model.joblib')

@app.route('/predict-turnover', methods=['GET'])
def predict_turnover():
    try:
        # Fetch all survey results
        surveys = SurveyResult.query.all()
        
        # Prepare features for prediction
        for survey in surveys:
            features = {
                'satisfaction_level': survey.satisfaction_level,
                'number_project': survey.num_projects,
                'average_montly_hours': survey.avg_monthly_hours,
                'time_spend_company': survey.years_at_company,
                'Work_accident': int(survey.work_accident),  # Ensure boolean is converted to int if needed
                'promotion_last_5years': int(survey.promotion_last_5years),
                'sales': survey.department,  
                'salary': survey.salary
            }

            df_features = pd.DataFrame([features], index=[0])
        
            # Predict turnover using the loaded model
            prediction = model.predict(df_features)

            survey.turnover_intent = prediction[0]
            db.session.commit()       

        return jsonify({"predictions": ""}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    




@app.route('/analytics/gender', methods=['GET'])
def analytics_by_gender():
    try:
        results = {}
        for gender in ['Male', 'Female']:
            count_per_gender = db.session.execute(text(f"select count(*) from survey_result as s join employee as e on s.employee_email = e.email where gender = '{gender}' and turnover_intent = true")).fetchone()
            total_entries_count = db.session.execute(text(f"select count(*) from survey_result as s join employee as e on s.employee_email = e.email where e.gender = '{gender}'")).fetchone()[0]
            if total_entries_count==0:
                continue
            results[gender] = count_per_gender[0]/total_entries_count * 100
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics/department', methods=['GET'])
def analytics_by_department():
    try:
        results = {}
        for department in department_list:
            count_per_department = db.session.execute(text(f"select count(*) from survey_result where department = '{department}' and turnover_intent = true")).fetchone()
            total_entries_count = db.session.execute(text(f"select count(*) from survey_result where department = '{department}'")).fetchone()[0]
            if total_entries_count==0:
                continue
            results[department] = count_per_department[0]/total_entries_count * 100
        print(results)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



from sqlalchemy import func


# @app.route('/analytics/age', methods=['GET'])
# def analytics_by_age():
#     try:
#         # Assuming you store date_of_birth and calculate age groups in the query
#         current_year = datetime.datetime.now().year
#         results = db.session.query(
#             ((current_year - func.extract('year', Employee.date_of_birth)) / 10).cast(db.Integer) * 10,
#             func.count(SurveyResult.id).filter(SurveyResult.turnover_intent == True).label('turnover')
#         ).join(SurveyResult, SurveyResult.employee_email == Employee.email)\
#         .group_by('age_group').all()

#         results = [{'age_group': f"{age_group}s", 'turnover': turnover} for age_group, turnover in results]
#         return jsonify(results), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
from backend.model.announcements import Announcements

@app.route('/', methods=['GET'])
def get_announcements():
    try:
        # Fetch query parameters
        sort_order = request.args.get('sort_order', default='newest', type=str)
        
        # Determine the sorting order based on the query parameter
        if sort_order == 'newest':
            # Fetch announcements ordered by date_posted in descending order
            announcements = Announcements.query.order_by(Announcements.date_posted.desc()).all()
        elif sort_order == 'oldest':
            # Fetch announcements ordered by date_posted in ascending order
            announcements = Announcements.query.order_by(Announcements.date_posted.asc()).all()
        else:
            # If sort_order is invalid, return a 400 Bad Request response
            return jsonify({'message': 'Invalid sort order parameter. Use "newest" or "oldest".'}), 400
        
        announcements_list = []
        for announcement in announcements:
            announcement_info = {
                'id' : announcement.id,
                'content': announcement.content,  # Access content attribute on the announcement object
                'date_posted': announcement.date_posted,
                'employee': {}  # Initialize employee dictionary
            }
            # Fetch employee information
            employee = db.session.execute(text("SELECT m.email, m.first_name, m.last_name FROM manager AS m JOIN announcements AS a ON m.email = a.employee_email WHERE a.employee_email = :email"), {'email': announcement.employee_email}).fetchone()
            if employee:
                announcement_info['employee'] = {
                    'email': employee.email,
                    'first_name': employee.first_name,
                    'last_name': employee.last_name,
                }
            announcements_list.append(announcement_info)
        return jsonify(announcements_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/announcement', methods=['POST'])
def create_announcement():
    try:
        # Get data from the request
        data = request.get_json()
        
        # Extract required fields from the request data
        content = data.get('content')
        employee_id = None
        token = extract_auth_token(request)
        if token:
            try:
                employee_id = decode_token(token)
            except:
                # If token decoding fails, return a 403 error
                abort(403)
        else:
            # If no token is provided, return a 401 Unauthorized response
            return jsonify({"message": "Authentication token required."}), 401
        if employee_id is None:
            return jsonify({"message": "Invalid user ID."}), 403
        employee_email = Manager.query.filter_by(email=employee_id).first()
        if not employee_email:
            return jsonify({"message": "User not found."}), 404
        employee_email = employee_email.email 

        # Get the current date and time
        current_date_time = datetime.datetime.now()
        
        # Create a new announcement object
        new_announcement = Announcements(
            content=content,
            date_posted=current_date_time,
            employee_email=employee_email
        )
        
        # Add the new announcement to the database
        db.session.add(new_announcement)
        db.session.commit()
        
        # Return a success message
        return jsonify({"message": "Announcement created successfully"}), 201
    
    except Exception as e:
        # If an error occurs, return an error message
        return jsonify({'error': str(e)}), 400
    
@app.route('/announcement/<int:id>', methods=['DELETE'])
def deleteAnnouncement(id):
    try:
        db.session.execute(text(f'delete from announcements where id = {id}'))
        db.session.commit()
        return jsonify({"message": "successfully deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "error"}), 400

