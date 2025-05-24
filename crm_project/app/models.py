from .main import db # Assuming db will be created in main.py

class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=True) # Assuming email can be optional
    phone = db.Column(db.String(20), nullable=True)  # Assuming phone can be optional
    status = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Lead {self.name}>'
