from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum


class Manager(db.model): #manager table
    email = db.Column(db.String(128) , primary_key=True)
    hashed_password = db.Column(db.String(128)) 
    first_name = db.Column(db.String(128)) 
    last_name = db.Column(db.String(128)) 
    def __init__(self, email, password, first_name, last_name ): 
        super(Manager, self).__init__(email=email, hashed_password = bcrypt.generate_password_hash(password), first_name = first_name, last_name=last_name) 

class ManagerSchema(ma.Schema): 
    class Meta: 
        fields = ("email", "first_name", "last_name") 
        model = Manager 

manager_schema = ManagerSchema() 
manager_schema = ManagerSchema(many=True)