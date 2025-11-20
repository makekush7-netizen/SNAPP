"""
AIVORA - Flask Backend
Works with React/Vite frontend + Gemini API
"""

from flask import Flask, jsonify, request, session, send_file
from flask_mysqldb import MySQL
import MySQLdb.cursors
import google.generativeai as genai
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
import base64
from PIL import Image
from io import BytesIO

# Initialize Flask
app = Flask(__name__)

# Serve React build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve React static files"""
    dist_path = os.path.join(os.path.dirname(__file__), '../frontend/dist')
    if path != '' and os.path.exists(os.path.join(dist_path, path)):
        return send_file(os.path.join(dist_path, path))
    else:
        return send_file(os.path.join(dist_path, 'index.html'))

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'aivora_db'
app.secret_key = 'aivora_secret_key_2024'

mysql = MySQL(app)

# Configure Gemini API
GEMINI_API_KEY = 'AIzaSyDrP_HHKghGp5VO0bCke7OgB1H_bOEFVK4'
genai.configure(api_key=GEMINI_API_KEY)


# ============== API ENDPOINTS ==============

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register new user"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        name = data.get('name', 'User').strip()
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 409
        
        hashed_password = generate_password_hash(password)
        cursor.execute('''INSERT INTO users (name, email, password, created_at) 
                         VALUES (%s, %s, %s, %s)''',
                      (name, email, hashed_password, datetime.now()))
        mysql.connection.commit()
        
        return jsonify({'success': True, 'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    """API login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['email'] = user['email']
            session['name'] = user['name']
            return jsonify({'success': True, 'user': {'id': user['id'], 'name': user['name'], 'email': user['email']}}), 200
        
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    """Logout user"""
    session.clear()
    return jsonify({'success': True}), 200

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Get current logged in user"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    return jsonify({
        'user_id': session.get('user_id'),
        'email': session.get('email'),
        'name': session.get('name')
    }), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat with Gemini"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        message = data.get('message') or data.get('question', '')
        
        if not message:
            return jsonify({'error': 'Message required'}), 400
        
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(message)
        
        # Store in chat history
        user_id = session.get('user_id')
        cursor = mysql.connection.cursor()
        cursor.execute('''INSERT INTO chat_history (user_id, question, answer, created_at)
                         VALUES (%s, %s, %s, %s)''',
                      (user_id, message, response.text, datetime.now()))
        mysql.connection.commit()
        
        return jsonify({
            'success': True,
            'question': message,
            'answer': response.text
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/summarize', methods=['POST'])
def summarize_note():
    """Summarize note with Gemini"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text required'}), 400
        
        model = genai.GenerativeModel('gemini-pro')
        summary_prompt = f"Provide a concise summary of the following:\n\n{text}"
        response = model.generate_content(summary_prompt)
        
        return jsonify({
            'success': True,
            'summary': response.text
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/ocr', methods=['POST'])
def process_note_image():
    """Process image note with OCR using Gemini vision API"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session.get('user_id')
        data = request.get_json()
        
        # Get base64 image
        image_data = data.get('image', '')
        file_name = data.get('fileName', 'note.jpg')
        
        if not image_data:
            return jsonify({'error': 'Image required'}), 400
        
        # Parse base64
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Use Gemini vision API
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([
            "Extract and summarize all the text and key points from this image. Format it clearly:",
            image
        ])
        
        # Store note in database
        cursor = mysql.connection.cursor()
        cursor.execute('''INSERT INTO notes (user_id, title, content, created_at)
                         VALUES (%s, %s, %s, %s)''',
                      (user_id, file_name, response.text, datetime.now()))
        mysql.connection.commit()
        note_id = cursor.lastrowid
        
        # Update progress
        cursor.execute('UPDATE progress SET notes_created = notes_created + 1 WHERE user_id = %s',
                      (user_id,))
        mysql.connection.commit()
        
        return jsonify({
            'success': True,
            'text': response.text,
            'summary': response.text,
            'note_id': note_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/code-help', methods=['POST'])
def get_code_help():
    """Get code help from Gemini"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        code = data.get('code', '')
        question = data.get('question', 'Help with this code')
        
        if not code:
            return jsonify({'error': 'Code required'}), 400
        
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"{question}\n\nCode:\n```\n{code}\n```"
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'analysis': response.text
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/notes', methods=['GET'])
def get_user_notes():
    """Get all notes for current user"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session.get('user_id')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT id, title FROM notes WHERE user_id = %s ORDER BY created_at DESC',
                      (user_id,))
        notes = cursor.fetchall()
        
        return jsonify({'success': True, 'notes': notes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz/generate', methods=['POST'])
def generate_quiz():
    """Generate quiz questions from note using Gemini"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session.get('user_id')
        data = request.get_json()
        note_id = data.get('noteId')
        
        if not note_id:
            return jsonify({'error': 'Note ID required'}), 400
        
        # Get note content
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT content FROM notes WHERE id = %s AND user_id = %s',
                      (note_id, user_id))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        # Generate quiz with Gemini
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""Create 5 multiple choice questions based on this text. 
        Format as JSON array with this structure:
        [
            {{
                "id": 1,
                "question": "Question text?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": "Option A"
            }}
        ]
        
        Text:
        {note['content']}
        
        Return ONLY the JSON array, no other text."""
        
        response = model.generate_content(prompt)
        
        # Parse JSON response
        import json
        try:
            questions = json.loads(response.text)
        except:
            # If JSON parsing fails, create a simple question
            questions = [{
                "id": 1,
                "question": "Based on the notes, what is the main topic?",
                "options": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
                "correct": "Topic 1"
            }]
        
        # Store quiz in database
        cursor.execute('''INSERT INTO quizzes (user_id, note_id, questions, created_at)
                         VALUES (%s, %s, %s, %s)''',
                      (user_id, note_id, json.dumps(questions), datetime.now()))
        mysql.connection.commit()
        
        # Update progress
        cursor.execute('UPDATE progress SET quizzes_taken = quizzes_taken + 1 WHERE user_id = %s',
                      (user_id,))
        mysql.connection.commit()
        
        return jsonify({
            'success': True,
            'questions': questions
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/progress', methods=['GET'])
def get_user_progress():
    """Get user progress stats"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session.get('user_id')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('''SELECT notes_created, quizzes_taken, questions_asked, 
                         study_streak, avg_score FROM progress WHERE user_id = %s''',
                      (user_id,))
        progress = cursor.fetchone()
        
        if not progress:
            # Create default progress if doesn't exist
            cursor.execute('''INSERT INTO progress (user_id, notes_created, quizzes_taken, 
                            questions_asked, study_streak, avg_score)
                            VALUES (%s, 0, 0, 0, 0, 0)''', (user_id,))
            mysql.connection.commit()
            progress = {
                'notes_created': 0,
                'quizzes_taken': 0,
                'questions_asked': 0,
                'study_streak': 0,
                'avg_score': 0
            }
        
        return jsonify({
            'success': True,
            'notes_created': progress['notes_created'],
            'quizzes_taken': progress['quizzes_taken'],
            'questions_asked': progress['questions_asked'],
            'study_streak': progress['study_streak'],
            'avg_score': progress['avg_score']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============== ERROR HANDLERS ==============

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Server error'}), 500

# ============== MAIN ==============

if __name__ == '__main__':
    print("✅ AIVORA Backend Starting...")
    print("📡 Running on http://localhost:5000")
    print("🔧 Using Gemini API - AIzaSyDrP_HHKghGp5VO0bCke7OgB1H_bOEFVK4")
    app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)
