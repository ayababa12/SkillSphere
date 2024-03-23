from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum


class Employee(db.Model): #employee table
    email = db.Column(db.Text() , primary_key=True)
    hashed_password = db.Column(db.Text()) 
    first_name = db.Column(db.Text()) 
    last_name = db.Column(db.Text()) 
    department = db.Column(db.Text())
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
many_employees_schema = EmployeeSchema(many=True)