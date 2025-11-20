"""Test notes endpoints"""
from app.models import Note

def test_upload_text_note(client, auth_headers):
    """Test uploading text note"""
    response = client.post('/api/notes/upload', headers=auth_headers, data={
        'title': 'Test Note',
        'source_type': 'text',
        'text': 'This is a test note with some learning material about physics and chemistry.'
    })
    assert response.status_code == 201
    assert response.json['note']['title'] == 'Test Note'
    assert response.json['note']['source_type'] == 'text'

def test_upload_text_note_too_short(client, auth_headers):
    """Test uploading text note that's too short"""
    response = client.post('/api/notes/upload', headers=auth_headers, data={
        'title': 'Short Note',
        'source_type': 'text',
        'text': 'Too short'
    })
    assert response.status_code == 422

def test_list_notes(client, auth_headers, test_user):
    """Test listing notes"""
    # Create a note
    note = Note(
        user_id=test_user.id,
        title='Test Note',
        source_type='text',
        processed_text='This is test content'
    )
    from app.extensions import db
    db.session.add(note)
    db.session.commit()
    
    response = client.get('/api/notes', headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json['notes']) == 1
    assert response.json['notes'][0]['title'] == 'Test Note'

def test_get_note(client, auth_headers, test_user):
    """Test getting note details"""
    note = Note(
        user_id=test_user.id,
        title='Detailed Note',
        source_type='text',
        processed_text='Detailed content'
    )
    from app.extensions import db
    db.session.add(note)
    db.session.commit()
    
    response = client.get(f'/api/notes/{note.id}', headers=auth_headers)
    assert response.status_code == 200
    assert response.json['note']['title'] == 'Detailed Note'

def test_get_note_not_found(client, auth_headers):
    """Test getting non-existent note"""
    response = client.get('/api/notes/nonexistent', headers=auth_headers)
    assert response.status_code == 404

def test_delete_note(client, auth_headers, test_user):
    """Test deleting note"""
    note = Note(
        user_id=test_user.id,
        title='Note to Delete',
        source_type='text',
        processed_text='Content'
    )
    from app.extensions import db
    db.session.add(note)
    db.session.commit()
    
    response = client.delete(f'/api/notes/{note.id}', headers=auth_headers)
    assert response.status_code == 200
    
    # Verify deletion
    response = client.get(f'/api/notes/{note.id}', headers=auth_headers)
    assert response.status_code == 404

def test_unauthorized_note_access(client, auth_headers, test_user):
    """Test that users can only access their own notes"""
    from app.extensions import db
    from app.models import User
    from werkzeug.security import generate_password_hash
    
    # Create another user
    other_user = User(
        email='other@example.com',
        password_hash=generate_password_hash('TestPass123'),
        display_name='Other User'
    )
    db.session.add(other_user)
    db.session.commit()
    
    # Create note for other user
    note = Note(
        user_id=other_user.id,
        title='Other User Note',
        source_type='text',
        processed_text='Content'
    )
    db.session.add(note)
    db.session.commit()
    
    # Try to access with first user's token
    response = client.get(f'/api/notes/{note.id}', headers=auth_headers)
    assert response.status_code == 404
