from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='../templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leads.db' # This will create leads.db in the instance folder
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Import models after db is defined to avoid circular import
from .models import Lead

@app.route('/')
def list_leads_route():
    leads_from_db = Lead.query.all()
    return render_template('list_leads.html', leads=leads_from_db)

@app.route('/add')
def add_lead_form_route():
    return render_template('add_lead.html')

@app.route('/add_lead_action', methods=['POST'])
def add_lead_action_route():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        status = request.form['status']
        
        new_lead = Lead(name=name, email=email, phone=phone, status=status)
        db.session.add(new_lead)
        db.session.commit()
        
        return redirect(url_for('list_leads_route'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create database tables if they don't exist
    app.run(debug=True, host='0.0.0.0', port=8080)
