from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum


class Employee(db.model): #employee table
    email = db.Column(db.String(128) , primary_key=True)
    hashed_password = db.Column(db.String(128)) 
    first_name = db.Column(db.String(128)) 
    last_name = db.Column(db.String(128)) 
    department = db.Column(db.String(128))
    date_joined = db.Column(db.DateTime)
    fill_survey = db.Column(db.Boolean)
    gender = db.Column(Enum('Male', 'Female', name='gender_enum'), nullable=False)
    date_of_birth = db.Column(db.DateTime)
    
    def __init__(self, email, password, first_name, last_name,  department, gender,date_of_birth ): 
        super(Employee, self).__init__(email=email, hashed_password = bcrypt.generate_password_hash(password),first_name=first_name, last_name=last_name, department=department,  date_joined=datetime.datetime.now(), fill_survey = False, gender=gender, date_of_birth= date_of_birth) 

class EmployeeSchema(ma.Schema): 
    class Meta: 
        fields = ("email", "first_name", "last_name","department", "date_joined", "fill_survey" , "gender", "date_of_birth") 
        model = Employee 

employee_schema = EmployeeSchema() 
employee_schema = EmployeeSchema(many=True)