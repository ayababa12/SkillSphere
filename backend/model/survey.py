from .app import db
from sqlalchemy import Integer, String, Boolean, Column

class Survey(db.Model):
    __tablename__ = 'surveys'

    id = db.Column(db.Integer, primary_key=True)
    satisfaction_level = db.Column(db.Integer, nullable=False)
    number_of_projects = db.Column(db.Integer, nullable=False)
    average_monthly_hours = db.Column(db.Integer, nullable=False)
    years_at_company = db.Column(db.Integer, nullable=False)
    work_accident = db.Column(db.Boolean, nullable=False)
    promotion_last_5years = db.Column(db.Boolean, nullable=False)
    department = db.Column(db.String(50), nullable=False)
    salary_classification = db.Column(db.String(50), nullable=False)
    employee_email = db.Column(db.String(100), db.ForeignKey('employees.email'), nullable=False)

    def __init__(self, satisfaction_level, number_of_projects, average_monthly_hours, years_at_company, work_accident, promotion_last_5years, department, salary_classification, employee_email):
        self.satisfaction_level = satisfaction_level
        self.number_of_projects = number_of_projects
        self.average_monthly_hours = average_monthly_hours
        self.years_at_company = years_at_company
        self.work_accident = work_accident
        self.promotion_last_5years = promotion_last_5years
        self.department = department
        self.salary_classification = salary_classification
        self.employee_email = employee_email

    def to_dict(self):
        return {
            'id': self.id,
            'satisfaction_level': self.satisfaction_level,
            'number_of_projects': self.number_of_projects,
            'average_monthly_hours': self.average_monthly_hours,
            'years_at_company': self.years_at_company,
            'work_accident': self.work_accident,
            'promotion_last_5years': self.promotion_last_5years,
            'department': self.department,
            'salary_classification': self.salary_classification,
            'employee_email': self.employee_email
        }
