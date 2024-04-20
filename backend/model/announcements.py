from ..app import db, ma
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Announcements(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    employee_email = db.Column(db.String(255), db.ForeignKey('employee.email'), nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False)
    content = db.Column(db.Text(), nullable=False)

    def __init__(self, employee_email, date_posted, content):
        self.employee_email = employee_email
        self.date_posted = date_posted
        self.content = content

class AnnouncementSchema(ma.Schema):
    class Meta:
        fields = ("id", "employee_email", "date_posted", "content")
        model = Announcements

announcement_schema = AnnouncementSchema()
many_announcement_schema = AnnouncementSchema(many=True)