from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum


class Manager(db.Model): #manager table
    email = db.Column(db.Text() , primary_key=True)
    hashed_password = db.Column(db.Text()) 
    first_name = db.Column(db.Text()) 
    last_name = db.Column(db.Text()) 
    def __init__(self, email, password, first_name, last_name ): 
        super(Manager, self).__init__(email=email, hashed_password = bcrypt.generate_password_hash(password), first_name = first_name, last_name=last_name) 

class ManagerSchema(ma.Schema): 
    class Meta: 
        fields = ("email", "first_name", "last_name") 
        model = Manager 

manager_schema = ManagerSchema() 
#managers_schema = ManagerSchema(many=True)