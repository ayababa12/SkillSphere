from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum

class Subtask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    hours = db.Column(db.Integer, nullable=True)
    deadline = db.Column(db.DateTime, nullable=True)
    is_completed = db.Column(db.Boolean, default=False)