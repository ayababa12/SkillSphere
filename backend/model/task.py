# from ..app import db, datetime, bcrypt, ma
# from sqlalchemy import Enum

# class Task(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(100), nullable=False)
#     description = db.Column(db.Text, nullable=True)
#     deadline = db.Column(db.DateTime, nullable=True)
#     is_completed = db.Column(db.Boolean, default=False)
#     subtasks = db.relationship('Subtask', backref='task', lazy='dynamic')
from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)  # Changed to required
    deadline = db.Column(db.DateTime, nullable=False)  # Changed to required
    is_completed = db.Column(db.Boolean, default=False)
    subtasks = db.relationship('Subtask', backref='task', lazy='dynamic')
