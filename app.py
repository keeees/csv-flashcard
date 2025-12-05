from flask import Flask, render_template, jsonify
from utils.file_manager import list_csv_files, read_file
from utils.csv_parser import parse_csv, CSVParseError

app = Flask(__name__)

# Add CORS headers for development
@app.after_request
def add_cors_headers(response):
    """Add CORS headers to all responses for development"""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/')
def index():
    """Serve main HTML page"""
    return render_template('index.html')


@app.route('/api/files')
def get_files():
    """Return list of available CSV files as JSON
    
    Returns:
        JSON response with list of CSV filenames
        
    Error responses:
        500: If directory cannot be accessed or other server error
    """
    try:
        files = list_csv_files('data')
        return jsonify({'files': files}), 200
    
    except FileNotFoundError as e:
        return jsonify({
            'error': 'Directory not found',
            'message': str(e)
        }), 500
    
    except PermissionError as e:
        return jsonify({
            'error': 'Permission denied',
            'message': str(e)
        }), 500
    
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': f'An unexpected error occurred: {str(e)}'
        }), 500


@app.route('/api/load/<filename>')
def load_file(filename):
    """Load and parse specified CSV file, return flashcards as JSON
    
    Args:
        filename: Name of the CSV file to load (from data/ directory)
        
    Returns:
        JSON response with filename and list of flashcard objects
        
    Error responses:
        400: If filename is invalid or CSV is malformed
        404: If file is not found
        500: If file cannot be read or other server error
    """
    try:
        # Read the file content
        csv_content = read_file(filename, base_directory='data')
        
        # Parse the CSV content into flashcards
        flashcards = parse_csv(csv_content)
        
        # Convert flashcards to dictionaries for JSON serialization
        cards_data = [card.to_dict() for card in flashcards]
        
        return jsonify({
            'filename': filename,
            'cards': cards_data
        }), 200
    
    except ValueError as e:
        # Invalid filepath (directory traversal attempt)
        return jsonify({
            'error': 'Invalid filename',
            'message': str(e)
        }), 400
    
    except FileNotFoundError as e:
        return jsonify({
            'error': 'File not found',
            'message': f'The requested CSV file does not exist'
        }), 404
    
    except CSVParseError as e:
        # Malformed CSV
        return jsonify({
            'error': 'Invalid CSV format',
            'message': str(e)
        }), 400
    
    except UnicodeDecodeError as e:
        return jsonify({
            'error': 'Encoding error',
            'message': 'Unable to read file. Please ensure the file is UTF-8 encoded.'
        }), 400
    
    except PermissionError as e:
        return jsonify({
            'error': 'Permission denied',
            'message': str(e)
        }), 500
    
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': f'An unexpected error occurred: {str(e)}'
        }), 500


if __name__ == '__main__':
    app.run(debug=True)
