"""Test configuration and fixtures"""
import pytest
from app import create_app
from app.extensions import db
from app.models import User
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    """Create and configure test app"""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Test client"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """CLI runner"""
    return app.test_cli_runner()

@pytest.fixture
def test_user(app):
    """Create test user"""
    user = User(
        email='test@example.com',
        password_hash=generate_password_hash('TestPass123'),
        display_name='Test User'
    )
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers"""
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'TestPass123'
    })
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}
