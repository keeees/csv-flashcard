/**
 * AppController - Main application controller
 * Coordinates all components and manages application state
 */
class AppController {
  constructor() {
    // Component instances
    this.deckManager = null;
    this.cardView = null;
    
    // Application state
    this.state = {
      currentFile: null,
      availableFiles: [],
      isLoading: false
    };
    
    // DOM elements
    this.elements = {
      fileSelect: null,
      cardContainer: null,
      progressText: null,
      prevBtn: null,
      nextBtn: null,
      shuffleBtn: null,
      restartBtn: null,
      errorMessage: null,
      fileUpload: null,
      uploadBtn: null
    };
  }
  
  /**
   * Initialize the application
   * Set up components, DOM references, and event listeners
   */
  async init() {
    // Get DOM element references
    this.elements.fileSelect = document.getElementById('file-select');
    this.elements.cardContainer = document.getElementById('card-container');
    this.elements.progressText = document.getElementById('progress-text');
    this.elements.prevBtn = document.getElementById('prev-btn');
    this.elements.nextBtn = document.getElementById('next-btn');
    this.elements.shuffleBtn = document.getElementById('shuffle-btn');
    this.elements.restartBtn = document.getElementById('restart-btn');
    this.elements.errorMessage = document.getElementById('error-message');
    this.elements.fileUpload = document.getElementById('file-upload');
    this.elements.uploadBtn = document.getElementById('upload-btn');
    
    // Initialize components
    this.deckManager = new DeckManager();
    this.cardView = new CardView(this.elements.cardContainer);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load available files
    await this.fetchFiles();
  }
  
  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // File selection
    this.elements.fileSelect.addEventListener('change', () => this.handleFileSelect());
    
    // Card click for flip
    const card = document.getElementById('flashcard');
    card.addEventListener('click', () => this.handleCardClick());
    
    // Navigation buttons
    this.elements.prevBtn.addEventListener('click', () => this.handlePreviousClick());
    this.elements.nextBtn.addEventListener('click', () => this.handleNextClick());
    
    // Action buttons
    this.elements.shuffleBtn.addEventListener('click', () => this.handleShuffleClick());
    this.elements.restartBtn.addEventListener('click', () => this.handleRestartClick());
    
    // Upload button
    this.elements.uploadBtn.addEventListener('click', () => this.handleUploadClick());
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }
  
  /**
   * Fetch available CSV files from the server
   * Requirements: 7.1
   */
  async fetchFiles() {
    try {
      const response = await fetch('/api/files');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.state.availableFiles = data.files || [];
      
      // Populate file selector dropdown
      this.populateFileSelector();
      
    } catch (error) {
      console.error('Error fetching files:', error);
      this.showError('Failed to load available files. Please refresh the page.');
    }
  }
  
  /**
   * Populate the file selector dropdown with available files
   */
  populateFileSelector() {
    // Clear existing options except the first placeholder
    while (this.elements.fileSelect.options.length > 1) {
      this.elements.fileSelect.remove(1);
    }
    
    // Add file options
    this.state.availableFiles.forEach(filename => {
      const option = document.createElement('option');
      option.value = filename;
      option.textContent = filename;
      this.elements.fileSelect.appendChild(option);
    });
    
    // Show message if no files available
    if (this.state.availableFiles.length === 0) {
      this.showError('No CSV files available. Please add CSV files to the data/ directory.');
    }
  }
  
  /**
   * Load a CSV file and parse its flashcards
   * Requirements: 1.1, 1.2, 7.2
   * @param {string} filename - Name of the CSV file to load
   */
  async loadFile(filename) {
    if (!filename) {
      return;
    }
    
    this.state.isLoading = true;
    
    try {
      const response = await fetch(`/api/load/${encodeURIComponent(filename)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to load file: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Load cards into deck manager
      this.deckManager.loadDeck(data.cards);
      
      // Update state
      this.state.currentFile = filename;
      
      // Render first card with question side
      const firstCard = this.deckManager.getCurrentCard();
      this.cardView.render(firstCard, true);
      
      // Update progress
      this.updateProgress();
      
      // Clear any error messages
      this.hideError();
      
    } catch (error) {
      console.error('Error loading file:', error);
      this.showError(`Failed to load file: ${error.message}`);
    } finally {
      this.state.isLoading = false;
    }
  }
  
  /**
   * Handle file selection from dropdown
   * Requirements: 1.1, 1.2, 7.2, 7.3
   */
  async handleFileSelect() {
    const selectedFile = this.elements.fileSelect.value;
    
    if (!selectedFile) {
      return;
    }
    
    await this.loadFile(selectedFile);
  }
  
  /**
   * Handle card click to flip
   * Requirements: 2.1, 2.5
   */
  handleCardClick() {
    // Only flip if not currently animating
    if (!this.cardView.isFlipping()) {
      this.cardView.flip();
    }
  }
  
  /**
   * Handle next button click
   * Requirements: 3.1, 3.2, 3.5
   */
  handleNextClick() {
    if (this.deckManager.cards.length === 0) {
      return;
    }
    
    // Navigate to next card
    this.deckManager.next();
    
    // Render new card with question side (reset flip state)
    const currentCard = this.deckManager.getCurrentCard();
    this.cardView.render(currentCard, true);
    
    // Update progress indicator
    this.updateProgress();
  }
  
  /**
   * Handle previous button click
   * Requirements: 3.1, 3.2, 3.5
   */
  handlePreviousClick() {
    if (this.deckManager.cards.length === 0) {
      return;
    }
    
    // Navigate to previous card
    this.deckManager.previous();
    
    // Render new card with question side (reset flip state)
    const currentCard = this.deckManager.getCurrentCard();
    this.cardView.render(currentCard, true);
    
    // Update progress indicator
    this.updateProgress();
  }
  
  /**
   * Handle shuffle button click
   * Requirements: 5.1, 5.2, 6.1, 6.2, 6.3
   */
  handleShuffleClick() {
    if (this.deckManager.cards.length === 0) {
      return;
    }
    
    // Shuffle the deck
    this.deckManager.shuffle();
    
    // Render first card with question side (reset flip state)
    const currentCard = this.deckManager.getCurrentCard();
    this.cardView.render(currentCard, true);
    
    // Update progress indicator
    this.updateProgress();
  }
  
  /**
   * Handle restart button click
   * Requirements: 5.1, 5.2, 6.1, 6.2, 6.3
   */
  handleRestartClick() {
    if (this.deckManager.cards.length === 0) {
      return;
    }
    
    // Restart the deck
    this.deckManager.restart();
    
    // Render first card with question side (reset flip state)
    const currentCard = this.deckManager.getCurrentCard();
    this.cardView.render(currentCard, true);
    
    // Update progress indicator
    this.updateProgress();
  }
  
  /**
   * Handle upload button click
   */
  async handleUploadClick() {
    const fileInput = this.elements.fileUpload;
    const file = fileInput.files[0];
    
    if (!file) {
      this.showError('Please select a file to upload');
      return;
    }
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.showError('Only CSV files are allowed');
      return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      this.state.isLoading = true;
      this.elements.uploadBtn.disabled = true;
      this.elements.uploadBtn.textContent = 'Uploading...';
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      // Show success message
      this.showSuccess(`${data.message} (${data.cardCount} cards)`);
      
      // Refresh file list
      await this.fetchFiles();
      
      // Auto-select the uploaded file
      this.elements.fileSelect.value = data.filename;
      await this.loadFile(data.filename);
      
      // Clear file input
      fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      this.showError(`Upload failed: ${error.message}`);
    } finally {
      this.state.isLoading = false;
      this.elements.uploadBtn.disabled = false;
      this.elements.uploadBtn.innerHTML = '<span aria-hidden="true">📤</span> Upload';
    }
  }
  
  /**
   * Handle keyboard events
   * Requirements: 9.1, 9.2, 9.3, 9.4
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyPress(event) {
    // Disable shortcuts when focus is in input elements
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT') {
      return;
    }
    
    // Map keyboard shortcuts to actions
    switch (event.key) {
      case ' ':  // Spacebar
      case 'Enter':
        event.preventDefault();  // Prevent page scroll on spacebar
        this.handleCardClick();
        break;
        
      case 'ArrowRight':
        event.preventDefault();
        this.handleNextClick();
        break;
        
      case 'ArrowLeft':
        event.preventDefault();
        this.handlePreviousClick();
        break;
        
      case 's':
      case 'S':
        event.preventDefault();
        this.handleShuffleClick();
        break;
        
      case 'r':
      case 'R':
        event.preventDefault();
        this.handleRestartClick();
        break;
    }
  }
  
  /**
   * Update the progress indicator
   */
  updateProgress() {
    const progress = this.deckManager.getProgress();
    this.elements.progressText.textContent = `${progress.current} of ${progress.total}`;
  }
  
  /**
   * Show an error message to the user
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.className = 'error-message';
    this.elements.errorMessage.style.display = 'block';
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }
  
  /**
   * Show a success message to the user
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.className = 'error-message success-message';
    this.elements.errorMessage.style.display = 'block';
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }
  
  /**
   * Hide the error message
   */
  hideError() {
    this.elements.errorMessage.style.display = 'none';
    this.elements.errorMessage.textContent = '';
    this.elements.errorMessage.className = 'error-message';
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.init();
});
