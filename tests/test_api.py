"""Unit tests for Flask API routes."""

import pytest
import json
from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_index_route(client):
    """Test that the index route serves the HTML page."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Flashcard Study App' in response.data


def test_get_files_success(client):
    """Test GET /api/files returns list of CSV files."""
    response = client.get('/api/files')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'files' in data
    assert isinstance(data['files'], list)
    
    # Should include flashcards.csv from data directory
    assert 'flashcards.csv' in data['files']


def test_load_file_success(client):
    """Test GET /api/load/<filename> returns parsed flashcards."""
    response = client.get('/api/load/flashcards.csv')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'filename' in data
    assert 'cards' in data
    assert data['filename'] == 'flashcards.csv'
    assert isinstance(data['cards'], list)
    
    # Verify flashcard structure
    if len(data['cards']) > 0:
        card = data['cards'][0]
        assert 'id' in card
        assert 'question' in card
        assert 'answer' in card


def test_load_file_not_found(client):
    """Test GET /api/load/<filename> with non-existent file returns 404."""
    response = client.get('/api/load/nonexistent.csv')
    assert response.status_code == 404
    
    data = json.loads(response.data)
    assert 'error' in data
    assert data['error'] == 'File not found'


def test_load_file_invalid_path(client):
    """Test GET /api/load/<filename> with directory traversal attempt returns 400."""
    # Test with a filename that contains path traversal characters
    # Note: Flask normalizes paths at the routing level, so we test with a filename
    # that would pass routing but fail our validation
    response = client.get('/api/load/..%2F..%2Fetc%2Fpasswd')
    
    # This might return 404 if Flask blocks it at routing level, or 400 if our validation catches it
    # Both are acceptable security responses
    assert response.status_code in [400, 404]
    
    if response.status_code == 400:
        data = json.loads(response.data)
        assert 'error' in data


def test_json_content_type(client):
    """Test that API routes return proper JSON content-type headers."""
    response = client.get('/api/files')
    assert 'application/json' in response.content_type
    
    response = client.get('/api/load/flashcards.csv')
    assert 'application/json' in response.content_type


def test_cors_headers(client):
    """Test that CORS headers are present for development."""
    response = client.get('/api/files')
    assert 'Access-Control-Allow-Origin' in response.headers
    assert response.headers['Access-Control-Allow-Origin'] == '*'
