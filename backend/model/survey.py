from ..app import db, datetime, bcrypt, ma
from sqlalchemy import Enum

class SurveyResult(db.Model):
    __tablename__ = 'survey_result'
    id = db.Column(db.Integer, primary_key=True)
   
    employee_email = db.Column(db.Text, nullable=False)
    satisfaction_level = db.Column(db.Float, nullable=False)
    num_projects = db.Column(db.Integer, nullable=False)
    avg_monthly_hours = db.Column(db.Integer, nullable=False)
    years_at_company = db.Column(db.Integer, nullable=False)
    work_accident = db.Column(db.Boolean, nullable=False)
    promotion_last_5years = db.Column(db.Boolean, nullable=False)
    department = db.Column(db.String(50), nullable=False)
    salary = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<SurveyResult {self.employee_email}>'

