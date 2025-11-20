"""Test authentication endpoints"""

def test_register(client):
    """Test user registration"""
    response = client.post('/api/auth/register', json={
        'email': 'newuser@example.com',
        'password': 'SecurePass123',
        'display_name': 'New User'
    })
    assert response.status_code == 201
    assert response.json['user']['email'] == 'newuser@example.com'
    assert 'access_token' in response.json

def test_register_invalid_email(client):
    """Test registration with invalid email"""
    response = client.post('/api/auth/register', json={
        'email': 'invalid-email',
        'password': 'SecurePass123'
    })
    assert response.status_code == 422

def test_register_weak_password(client):
    """Test registration with weak password"""
    response = client.post('/api/auth/register', json={
        'email': 'user@example.com',
        'password': 'weak'
    })
    assert response.status_code == 422

def test_login(client, test_user):
    """Test user login"""
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'TestPass123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert 'refresh_token' in response.json

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    response = client.post('/api/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'WrongPass123'
    })
    assert response.status_code == 401

def test_profile(client, auth_headers):
    """Test get profile"""
    response = client.get('/api/auth/profile', headers=auth_headers)
    assert response.status_code == 200
    assert response.json['user']['email'] == 'test@example.com'

def test_profile_unauthorized(client):
    """Test get profile without authorization"""
    response = client.get('/api/auth/profile')
    assert response.status_code == 401
