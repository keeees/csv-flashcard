# Implementation Plan

- [x] 1. Set up project structure and testing framework
  - Create project directory structure (app.py, models/, utils/, tests/, static/, templates/, data/)
  - Create requirements.txt with Flask, pytest, hypothesis dependencies
  - Set up pytest configuration (pytest.ini or pyproject.toml)
  - Create __init__.py files for Python packages
  - Create basic Flask app skeleton in app.py with routes
  - Create data/ directory for CSV files and copy flashcards.csv there
  - _Requirements: All_

- [x] 2. Implement Flashcard data model
  - Create models/flashcard.py with Flashcard dataclass
  - Add fields: id (int), question (str), answer (str)
  - Implement to_dict() method for JSON serialization
  - Implement from_dict() class method for deserialization
  - _Requirements: 1.1, 1.4_

- [ ]* 2.1 Write unit tests for Flashcard model
  - Test Flashcard creation with valid data
  - Test to_dict() serialization
  - Test from_dict() deserialization
  - _Requirements: 1.1_

- [x] 3. Implement CSV parser module
  - Create utils/csv_parser.py
  - Write parse_csv() function that uses Python csv module
  - Implement validation for CSV structure (minimum 2 columns)
  - Add UTF-8 encoding support for international characters
  - Implement empty row filtering logic
  - Handle edge cases (trailing commas, quotes, special characters)
  - Return list of Flashcard objects
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [ ]* 3.1 Write property test for CSV parsing round trip
  - **Property 1: CSV parsing round trip consistency**
  - **Validates: Requirements 1.1, 1.4**

- [ ]* 3.2 Write property test for empty row filtering
  - **Property 7: Empty row filtering**
  - **Validates: Requirements 1.5**

- [ ]* 3.3 Write property test for malformed CSV error handling
  - **Property 12: Malformed CSV error handling**
  - **Validates: Requirements 1.2**

- [ ]* 3.4 Write unit tests for CSV parser edge cases
  - Test CSV with special characters and Chinese text
  - Test CSV with various malformed structures
  - Test empty CSV file
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 4. Implement file manager module
  - Create utils/file_manager.py
  - Write list_csv_files() function to scan data/ directory
  - Write read_file() function with UTF-8 encoding
  - Implement error handling for missing files and permission errors
  - Add path validation to prevent directory traversal attacks
  - _Requirements: 7.1, 7.2_

- [ ]* 4.1 Write unit tests for file manager
  - Test listing CSV files with mock filesystem
  - Test reading file with UTF-8 content
  - Test error handling for missing files
  - Test path validation security
  - _Requirements: 7.1, 7.2_

- [x] 5. Implement Flask API routes
  - Create route GET / to serve index.html template
  - Create route GET /api/files to return list of CSV files as JSON
  - Create route GET /api/load/<filename> to load and parse CSV file
  - Implement error handling with appropriate HTTP status codes
  - Return JSON responses with proper content-type headers
  - Add CORS headers if needed for development
  - _Requirements: 1.1, 1.2, 7.1, 7.2_

- [ ]* 5.1 Write unit tests for API routes
  - Test GET /api/files returns file list
  - Test GET /api/load/<filename> returns parsed flashcards
  - Test error responses for invalid filenames
  - Test error responses for malformed CSV
  - _Requirements: 1.1, 1.2, 7.1, 7.2_

- [x] 6. Create HTML structure
  - Create templates/index.html with Flask template syntax
  - Build semantic HTML with header, main content area, and controls
  - Create dropdown/select element for file list
  - Add card container div with data attributes for flip state
  - Create progress indicator element
  - Add navigation buttons (previous, next)
  - Add action buttons (shuffle, restart)
  - Include ARIA labels for accessibility
  - Add keyboard shortcut hints in UI
  - Link to CSS and JavaScript files in static/
  - _Requirements: 7.1, 8.5, 9.1, 9.2, 9.3_

- [x] 7. Implement CSS styling and animations
  - Create static/css/style.css
  - Define CSS custom properties for colors and spacing
  - Style card container with white background and shadow
  - Implement 3D flip animation using CSS transforms
  - Add perspective to card container for 3D effect
  - Style buttons with hover states and icons
  - Create responsive layout with media queries
  - Ensure sufficient color contrast for readability
  - Add focus indicators for keyboard navigation
  - Style file selector dropdown
  - Style progress indicator
  - _Requirements: 8.1, 8.3, 8.4, 8.5_

- [x] 8. Implement frontend DeckManager class
  - Create static/js/deckManager.js
  - Implement DeckManager class with cards array and currentIndex
  - Write loadDeck() method to initialize deck from API response
  - Implement getCurrentCard() method
  - Implement getProgress() method returning {current, total}
  - Store originalOrder for restart functionality
  - _Requirements: 3.1, 3.2, 4.1, 4.4_

- [x] 8.1 Implement navigation methods
  - Write next() method with wrapping logic (last → first)
  - Write previous() method with wrapping logic (first → last)
  - Ensure navigation updates currentIndex correctly
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 8.2 Implement shuffle method
  - Write shuffle() method using Fisher-Yates algorithm
  - Reset currentIndex to 0 after shuffle
  - Preserve originalOrder for potential restart
  - _Requirements: 6.1, 6.2_

- [x] 8.3 Implement restart method
  - Write restart() method that resets currentIndex to 0
  - Ensure restart preserves current card order (shuffled or original)
  - _Requirements: 5.1, 5.3_

- [x] 9. Implement frontend CardView class
  - Create static/js/cardView.js
  - Create CardView class to manage card display and flip state
  - Write render() method that updates DOM with card content
  - Implement isFlipped state tracking (boolean)
  - Implement isAnimating flag to prevent concurrent flips
  - Add isFlipping() method to check if animation is in progress
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 9.1 Implement flip animation
  - Write flip() method that toggles isFlipped state
  - Set isAnimating flag during animation
  - Trigger CSS 3D transform for flip effect
  - Clear isAnimating flag after 600ms
  - Prevent flip if isAnimating is true
  - _Requirements: 2.1, 2.4, 2.5_

- [ ] 10. Implement frontend AppController
  - Create static/js/app.js
  - Create AppController class to coordinate all components
  - Initialize DeckManager and CardView instances
  - Create application state object to track current file and UI state
  - Write init() method to set up initial state and event listeners
  - _Requirements: All_

- [x] 10.1 Implement API communication methods
  - Write async fetchFiles() method to call GET /api/files
  - Write async loadFile(filename) method to call GET /api/load/<filename>
  - Handle fetch errors and display user-friendly messages
  - Parse JSON responses
  - _Requirements: 1.1, 1.2, 7.2_

- [x] 10.2 Implement card interaction handlers
  - Write handleCardClick() to trigger flip animation
  - Ensure flip only occurs when not animating
  - Update UI to reflect flipped state
  - _Requirements: 2.1, 2.5_

- [x] 10.3 Implement navigation handlers
  - Write handleNextClick() to call DeckManager.next()
  - Write handlePreviousClick() to call DeckManager.previous()
  - Reset flip state to question side on navigation
  - Update CardView with new card content
  - Update progress indicator
  - _Requirements: 3.1, 3.2, 3.5_

- [x] 10.4 Implement action button handlers
  - Write handleShuffleClick() to call DeckManager.shuffle()
  - Write handleRestartClick() to call DeckManager.restart()
  - Reset flip state and update UI after shuffle/restart
  - Update CardView and progress indicator
  - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3_

- [x] 10.5 Implement file selection handler
  - Write handleFileSelect() to load selected CSV file via API
  - Call loadFile() with selected filename
  - Load parsed cards into DeckManager
  - Reset to first card with question side showing
  - Update UI to show new deck
  - Handle file loading errors with user-friendly messages
  - _Requirements: 1.1, 1.2, 7.2, 7.3_

- [x] 10.6 Implement keyboard event handlers
  - Write handleKeyPress() to listen for keyboard events
  - Map spacebar/Enter to flip action
  - Map right arrow to next action
  - Map left arrow to previous action
  - Disable shortcuts when focus is in input elements
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 11. Implement error handling and edge cases
  - Add error message display area in HTML
  - Implement showError() function in JavaScript with auto-dismiss
  - Handle empty deck state with appropriate message
  - Handle no files available state
  - Add try-catch blocks around API calls
  - Display user-friendly error messages for all error types
  - Ensure application remains functional after errors
  - _Requirements: 1.2, 4.3, 7.4_

- [ ] 12. Test with real data and integrate
  - Ensure flashcards.csv is in data/ directory
  - Start Flask development server
  - Test loading and displaying Chinese characters
  - Verify all navigation and flip functionality works
  - Test shuffle and restart with the real dataset
  - Verify progress indicator shows correct values
  - Test file selection dropdown
  - _Requirements: 1.1, 1.4, 7.1_

- [ ] 13. Final integration and polish
  - Test complete user workflow: select file → navigate → flip → shuffle → restart
  - Verify keyboard shortcuts work throughout
  - Test responsive design on different screen sizes
  - Verify all animations are smooth
  - Check accessibility with keyboard-only navigation
  - Add any missing ARIA labels
  - Test with multiple CSV files
  - Verify UTF-8 encoding works correctly for Chinese text
  - _Requirements: All_

- [ ] 14. Checkpoint - Ensure all tests pass
  - Run pytest to ensure all backend tests pass
  - Manually test all frontend functionality
  - Ask the user if questions arise
