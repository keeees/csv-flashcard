"""Desktop version of flashcard app - auto-opens browser"""
import webbrowser
import threading
from app import app

def open_browser():
    """Open browser after short delay"""
    import time
    time.sleep(1.5)
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == '__main__':
    # Open browser in background thread
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Run Flask app
    print("Starting Flashcard App...")
    print("Browser will open automatically...")
    app.run(port=5000, debug=False)
