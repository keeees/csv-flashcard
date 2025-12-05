# Flashcard Web Application - Design Document

## Overview

The Flashcard Web Application is a web-based application built with Python (Flask backend) and HTML/CSS/JavaScript (frontend). It provides an interactive study experience similar to Quizlet, allowing users to load CSV files containing question-answer pairs and study them through an intuitive card-flipping interface. The application emphasizes simplicity, visual appeal, and smooth animations to create an engaging learning environment.

The application uses Flask to serve the web interface and handle CSV file operations. The backend manages file listing, loading, and parsing, while the frontend provides the interactive UI with card flipping and navigation. All CSV files will be stored in a designated directory on the server.

## Architecture

### High-Level Architecture

The application follows a client-server architecture with Flask backend and JavaScript frontend:

```
┌─────────────────────────────────────────────┐
│         Frontend (HTML/CSS/JS)               │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │ Card    │ │ Controls│ │ File Selector│  │
│  │ Display │ │ Panel   │ │              │  │
│  └─────────┘ └─────────┘ └──────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │   JavaScript State & Event Handlers   │  │
│  └──────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │ HTTP/JSON
┌─────────────────▼───────────────────────────┐
│           Flask Backend (Python)             │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ API Routes   │  │ File Management      │ │
│  │              │  │                      │ │
│  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ CSV Parser   │  │ Flashcard Models     │ │
│  │              │  │                      │ │
│  └──────────────┘  └──────────────────────┘ │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          File System (CSV Files)             │
└─────────────────────────────────────────────┘
```

### Component Breakdown

1. **Frontend Layer** (HTML/CSS/JavaScript):
   - Card display component with flip animations
   - Control panel with navigation and action buttons
   - File selector dropdown
   - Progress indicator
   - Client-side state management
   - Event handlers for user interactions

2. **Backend Layer** (Python/Flask):
   - API routes for file operations
   - CSV parsing and validation
   - File listing and loading
   - Error handling and response formatting

3. **Data Layer**:
   - CSV files stored in designated directory
   - Flashcard data models
   - Deck operations (shuffle, navigation) handled client-side

## Components and Interfaces

### 1. Flashcard Data Model (Python)

```python
from dataclasses import dataclass
from typing import List

@dataclass
class Flashcard:
    question: str
    answer: str
    id: int

@dataclass
class FlashcardDeck:
    cards: List[Flashcard]
    filename: str
```

### 2. CSV Parser Module (Python)

**Responsibilities:**
- Parse CSV file content into flashcard objects
- Validate CSV structure
- Handle encoding issues (UTF-8 support for Chinese characters)
- Skip empty rows

**Interface:**
```python
def parse_csv(csv_content: str) -> List[Flashcard]:
    """Parse CSV content into list of Flashcard objects"""
    pass

def validate_csv_structure(csv_content: str) -> bool:
    """Validate that CSV has proper structure"""
    pass

def load_csv_file(filepath: str) -> List[Flashcard]:
    """Load and parse CSV file from filesystem"""
    pass
```

### 3. File Manager Module (Python)

**Responsibilities:**
- Discover available CSV files in directory
- Load selected CSV file
- Handle file reading errors

**Interface:**
```python
def list_csv_files(directory: str) -> List[str]:
    """List all CSV files in the specified directory"""
    pass

def read_file(filepath: str) -> str:
    """Read file content with UTF-8 encoding"""
    pass
```

### 4. Flask API Routes (Python)

**Responsibilities:**
- Serve HTML/CSS/JS frontend
- Provide API endpoints for file operations
- Handle errors and return JSON responses

**Interface:**
```python
@app.route('/')
def index():
    """Serve main HTML page"""
    pass

@app.route('/api/files')
def get_files():
    """Return list of available CSV files"""
    pass

@app.route('/api/load/<filename>')
def load_file(filename):
    """Load and parse specified CSV file, return flashcards as JSON"""
    pass
```

### 5. Frontend Deck Manager (JavaScript)

**Responsibilities:**
- Maintain current deck state client-side
- Handle navigation (next, previous)
- Shuffle deck while preserving original order
- Reset deck to beginning

**Interface:**
```javascript
class DeckManager {
  loadDeck(cards) { }
  next() { }
  previous() { }
  shuffle() { }
  restart() { }
  getCurrentCard() { }
  getProgress() { }
}
```

### 6. Frontend Card View (JavaScript)

**Responsibilities:**
- Render flashcard with question/answer
- Handle flip animation
- Update card content on navigation

**Interface:**
```javascript
class CardView {
  render(card, showQuestion) { }
  flip() { }
  isFlipping() { }
}
```

### 7. Frontend Application Controller (JavaScript)

**Responsibilities:**
- Initialize application
- Wire up event handlers
- Coordinate between components
- Manage application state
- Make API calls to backend

**Interface:**
```javascript
class AppController {
  init() { }
  handleCardClick() { }
  handleNextClick() { }
  handlePreviousClick() { }
  handleShuffleClick() { }
  handleRestartClick() { }
  handleFileSelect(filename) { }
  handleKeyPress(event) { }
  async fetchFiles() { }
  async loadFile(filename) { }
}
```

## Data Models

### Flashcard Structure (JSON)

```json
{
  "id": 1,
  "question": "19世纪初拉丁美洲独立运动的背景之一是什么？",
  "answer": "西班牙、葡萄牙残酷的殖民统治引发了拉丁美洲人民的强烈不满。"
}
```

### API Response Format

**GET /api/files**
```json
{
  "files": ["flashcards.csv", "history.csv", "science.csv"]
}
```

**GET /api/load/<filename>**
```json
{
  "filename": "flashcards.csv",
  "cards": [
    {"id": 1, "question": "...", "answer": "..."},
    {"id": 2, "question": "...", "answer": "..."}
  ]
}
```

**Error Response**
```json
{
  "error": "File not found",
  "message": "The requested CSV file does not exist"
}
```

### Frontend Application State (JavaScript)

```javascript
{
  deck: {
    cards: Array,
    currentIndex: number,
    originalOrder: Array
  },
  ui: {
    isFlipped: boolean,
    isAnimating: boolean,
    selectedFile: string
  },
  availableFiles: Array
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas where properties overlap or can be consolidated:

- Navigation properties (3.1, 3.2, 3.3, 3.4) can be unified into a single wrapping property
- Progress indicator properties (4.1, 4.2, 4.4) share the same underlying validation
- Restart properties (5.1, 5.2, 5.3) can be combined into comprehensive restart behavior
- Shuffle properties (6.1, 6.2, 6.3) can be unified into complete shuffle behavior
- Keyboard navigation (9.2, 9.3) tests the same equivalence as button navigation

The following properties represent the minimal set needed for comprehensive validation:

### Property 1: CSV parsing round trip consistency
*For any* valid flashcard deck, if we serialize it to CSV format and then parse it back, the resulting deck should contain the same questions and answers in the same order.
**Validates: Requirements 1.1, 1.4**

### Property 2: Navigation wrapping consistency
*For any* non-empty flashcard deck, repeatedly calling next() should eventually return to the first card, and the number of next() calls required should equal the deck size. Similarly, repeatedly calling previous() from the first card should wrap to the last card.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 3: Shuffle preserves deck contents
*For any* flashcard deck, shuffling should produce a deck with the same cards (same questions and answers) but potentially in a different order, with no cards added or removed, and should reset to the first card showing the question side.
**Validates: Requirements 6.1, 6.2, 6.3**

### Property 4: Progress indicator accuracy
*For any* valid deck position, the progress indicator should show current position X and total Y where 1 ≤ X ≤ Y, Y equals the deck size, and the format is "X of Y".
**Validates: Requirements 4.1, 4.2, 4.4**

### Property 5: Flip state consistency
*For any* flashcard, flipping twice should return to the original side (question → answer → question), demonstrating idempotent behavior.
**Validates: Requirements 2.1**

### Property 6: Restart resets to initial state
*For any* deck state (regardless of current position or shuffle status), calling restart should set the current index to 0, display the question side of the first card, and preserve the current card order.
**Validates: Requirements 5.1, 5.2, 5.3**

### Property 7: Empty row filtering
*For any* CSV content containing empty rows, the parsed deck should contain only non-empty flashcards with valid question-answer pairs, with all empty rows removed.
**Validates: Requirements 1.5**

### Property 8: Keyboard navigation equivalence
*For any* deck state, using keyboard shortcuts (arrow keys for navigation, spacebar/Enter for flip) should produce the same state changes as clicking the corresponding UI buttons.
**Validates: Requirements 9.1, 9.2, 9.3**

### Property 9: Navigation resets flip state
*For any* flashcard in any flip state, navigating to a different card (via next, previous, or restart) should always display the question side of the new card.
**Validates: Requirements 3.5**

### Property 10: Card side rendering exclusivity
*For any* flashcard, when displaying the question side, only the question text should be visible, and when displaying the answer side, only the answer text should be visible.
**Validates: Requirements 2.2, 2.3**

### Property 11: File switching resets session
*For any* current deck state, switching to a different CSV file should reset the position to the first card and display the question side.
**Validates: Requirements 7.3**

### Property 12: Malformed CSV error handling
*For any* CSV content that is malformed (missing columns, invalid structure), the parser should reject it and return an error without loading partial data.
**Validates: Requirements 1.2**

## Error Handling

### CSV Parsing Errors

1. **Malformed CSV**: Display error message "Invalid CSV format. Please ensure the file has two columns: question and answer."
2. **Empty File**: Display message "The selected file is empty. Please choose a file with flashcard data."
3. **Encoding Issues**: Attempt UTF-8 decoding; if it fails, display "Unable to read file. Please ensure the file is UTF-8 encoded."
4. **Missing Columns**: Display "CSV must have at least two columns for questions and answers."

### File Loading Errors

1. **File Not Found**: Display "Could not load the selected file. Please try again."
2. **Permission Denied**: Display "Unable to access the file. Please check file permissions."
3. **Network Error** (if loading from URL): Display "Network error. Please check your connection."

### Runtime Errors

1. **Animation Conflicts**: Prevent multiple simultaneous flip animations by checking `isAnimating` flag
2. **Invalid Navigation**: Gracefully handle navigation on empty deck by displaying "No cards available"
3. **Keyboard Event Conflicts**: Disable keyboard shortcuts when user is in input fields

### Error Recovery

- All errors should be non-fatal and allow the user to continue using the application
- Error messages should be displayed in a prominent but non-intrusive notification area
- After an error, the application should remain in a consistent state
- Users should be able to retry failed operations (e.g., reload a file)

## Testing Strategy

### Unit Testing

The application will use **pytest** as the testing framework for Python backend unit tests. Unit tests will cover:

1. **CSV Parser** (Python):
   - Valid CSV with multiple rows
   - CSV with empty rows
   - CSV with special characters (Chinese text)
   - Malformed CSV (missing columns, inconsistent structure)

2. **File Manager** (Python):
   - Listing CSV files in directory
   - Reading file with UTF-8 encoding
   - Handling missing files
   - Handling permission errors

3. **API Routes** (Python):
   - GET /api/files returns correct file list
   - GET /api/load/<filename> returns parsed flashcards
   - Error responses for invalid requests
   - JSON serialization of flashcard objects

4. **Frontend Deck Manager** (JavaScript - optional):
   - Navigation through small deck (2-3 cards)
   - Navigation at boundaries (first/last card)
   - Restart functionality
   - Empty deck handling

### Property-Based Testing

The application will use **Hypothesis** (Python property-based testing library) for property-based tests. Each property test will run a minimum of 100 iterations.

Property-based tests will verify:

1. **Property 1: CSV parsing round trip** - Generate random flashcard decks, serialize to CSV, parse back, verify equality
2. **Property 2: Navigation wrapping** - Generate random deck sizes, verify next() cycles correctly (frontend logic)
3. **Property 3: Shuffle preservation** - Generate random decks, shuffle, verify same cards exist (frontend logic)
4. **Property 4: Progress accuracy** - Generate random deck positions, verify progress calculation (frontend logic)
5. **Property 5: Flip state** - Generate random flip sequences, verify state consistency (frontend logic)
6. **Property 6: Restart behavior** - Generate random deck states, verify restart resets correctly (frontend logic)
7. **Property 7: Empty row filtering** - Generate CSV with random empty rows, verify filtering
8. **Property 8: Keyboard equivalence** - Generate random navigation sequences, verify keyboard matches button behavior (frontend logic)

Each property-based test will be tagged with a comment in the format:
```python
# Feature: flashcard-webapp, Property X: [property description]
```

### Integration Testing

Integration tests will verify:
- End-to-end file loading and display
- Complete user workflows (load → navigate → shuffle → restart)
- UI updates in response to state changes

### Manual Testing Checklist

- Visual appearance across different screen sizes
- Animation smoothness and timing
- Accessibility (keyboard navigation, screen readers)
- Performance with large decks (100+ cards)

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                   Header                             │
│              Flashcard Study App                     │
├─────────────────────────────────────────────────────┤
│                                                       │
│              ┌─────────────────────┐                 │
│              │                     │                 │
│              │    File Selector    │                 │
│              │    [Dropdown ▼]     │                 │
│              └─────────────────────┘                 │
│                                                       │
│         ┌───────────────────────────────┐            │
│         │                               │            │
│         │                               │            │
│         │        Flashcard              │            │
│         │        Content                │            │
│         │        (Click to flip)        │            │
│         │                               │            │
│         │                               │            │
│         └───────────────────────────────┘            │
│                                                       │
│              Progress: 1 of 65                        │
│                                                       │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐          │
│    │ ◄  │  │ ►  │  │ 🔀 │  │ ↻  │  │ ⌨  │          │
│    │Prev│  │Next│  │Shuf│  │Rest│  │Keys│          │
│    └────┘  └────┘  └────┘  └────┘  └────┘          │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Visual Design Principles

1. **Color Scheme**:
   - Primary: Modern blue (#4A90E2)
   - Secondary: Soft gray (#F5F5F5)
   - Accent: Vibrant green (#2ECC71) for success states
   - Text: Dark gray (#333333) for readability
   - Card background: White (#FFFFFF) with subtle shadow

2. **Typography**:
   - Headings: Sans-serif, bold, 24-32px
   - Card content: Sans-serif, 18-20px for readability
   - Support for Chinese characters with appropriate font stack
   - Line height: 1.6 for comfortable reading

3. **Animations**:
   - Card flip: 3D transform with 600ms duration, ease-in-out timing
   - Button hover: Subtle scale (1.05) and color shift
   - Transitions: 200ms for UI feedback
   - Loading states: Smooth fade-in

4. **Responsive Design**:
   - Mobile (< 768px): Stacked layout, larger touch targets
   - Tablet (768px - 1024px): Optimized spacing
   - Desktop (> 1024px): Maximum width container, centered layout

### Accessibility Considerations

- ARIA labels for all interactive elements
- Keyboard navigation support (Tab, Enter, Space, Arrows)
- Focus indicators for keyboard users
- Sufficient color contrast (WCAG AA compliance)
- Screen reader announcements for card changes

## Technology Stack

### Backend
- **Python 3.8+**: Core language
- **Flask**: Web framework for API and serving frontend
- **pytest**: Unit testing framework
- **Hypothesis**: Property-based testing library
- **CSV module**: Built-in Python CSV parsing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Flexbox/Grid for layout, CSS animations for transitions
- **Vanilla JavaScript (ES6+)**: Client-side logic, no framework dependencies
- **Fetch API**: For making HTTP requests to backend

### Development
- **UTF-8 Encoding**: Support for international characters (Chinese text)
- **JSON**: Data exchange format between frontend and backend

## Implementation Notes

### File Loading Strategy

The application uses a server-side file management approach:

1. **CSV Directory**: All CSV files are stored in a `data/` directory on the server
2. **File Listing**: Backend scans the directory and returns available files via API
3. **File Loading**: Backend reads and parses selected CSV file, returns JSON to frontend
4. **No Upload**: Initial version does not support file upload (files must be placed in data/ directory manually)

### Project Structure

```
flashcard-webapp/
├── app.py                 # Flask application
├── models/
│   ├── __init__.py
│   └── flashcard.py       # Flashcard data models
├── utils/
│   ├── __init__.py
│   ├── csv_parser.py      # CSV parsing logic
│   └── file_manager.py    # File operations
├── tests/
│   ├── __init__.py
│   ├── test_csv_parser.py
│   ├── test_file_manager.py
│   └── test_api.py
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── deckManager.js
│       ├── cardView.js
│       └── app.js
├── templates/
│   └── index.html
├── data/
│   └── flashcards.csv     # CSV files go here
└── requirements.txt
```

### State Management

Frontend uses a simple state object with reactive updates:

```javascript
const state = {
  _data: {},
  _listeners: {},
  set(key, value) {
    this._data[key] = value;
    this.notify(key, value);
  },
  get(key) {
    return this._data[key];
  },
  subscribe(key, callback) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(callback);
  },
  notify(key, value) {
    if (this._listeners[key]) {
      this._listeners[key].forEach(cb => cb(value));
    }
  }
};
```

### Performance Considerations

- Lazy rendering: Only render the current card, not all cards
- Debounce keyboard events to prevent rapid-fire navigation
- Use CSS transforms for animations (GPU-accelerated)
- Limit deck size warnings for very large files (> 1000 cards)

## Future Enhancements

Potential features for future iterations:
- Progress tracking (mark cards as "known" or "review")
- Spaced repetition algorithm
- Multiple study modes (multiple choice, typing answers)
- Export study statistics
- Dark mode theme
- Audio pronunciation support
- Image support in flashcards
