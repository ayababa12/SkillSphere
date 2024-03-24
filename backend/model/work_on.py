from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum


class WorkOn(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subtask_id = db.Column(db.Integer, db.ForeignKey('subtask.id'), nullable=False)
    employee_email = db.Column(db.Integer, db.ForeignKey('employee.email'), nullable=False)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)  