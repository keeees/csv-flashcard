from flask import Flask, render_template, jsonify, request
from utils.file_manager import list_csv_files, read_file
from utils.csv_parser import parse_csv, CSVParseError
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'data'

# Add CORS headers for development
@app.after_request
def add_cors_headers(response):
    """Add CORS headers to all responses for development"""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'csv'


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


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload a CSV file to the data directory
    
    Returns:
        JSON response with success status and filename
        
    Error responses:
        400: If no file provided, invalid file type, or CSV is malformed
        500: If file cannot be saved or other server error
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({
                'error': 'No file provided',
                'message': 'Please select a file to upload'
            }), 400
        
        file = request.files['file']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'Invalid file type',
                'message': 'Only CSV files are allowed'
            }), 400
        
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Ensure data directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Read file content for validation
        file_content = file.read().decode('utf-8')
        
        # Validate CSV format by parsing it
        try:
            flashcards = parse_csv(file_content)
            if len(flashcards) == 0:
                return jsonify({
                    'error': 'Empty CSV',
                    'message': 'The CSV file contains no valid flashcards'
                }), 400
        except CSVParseError as e:
            return jsonify({
                'error': 'Invalid CSV format',
                'message': str(e)
            }), 400
        
        # Save the file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(file_content)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'message': f'File "{filename}" uploaded successfully',
            'cardCount': len(flashcards)
        }), 200
    
    except UnicodeDecodeError:
        return jsonify({
            'error': 'Encoding error',
            'message': 'Unable to read file. Please ensure the file is UTF-8 encoded.'
        }), 400
    
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': f'An unexpected error occurred: {str(e)}'
        }), 500


if __name__ == '__main__':
    app.run(debug=True)
