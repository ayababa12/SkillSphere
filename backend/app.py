from flask import Flask
import sqlite3
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillsphere.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
ma = Marshmallow(app)

