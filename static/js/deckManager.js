/**
 * DeckManager - Manages flashcard deck state and operations
 * Handles navigation, shuffling, and restart functionality
 */
class DeckManager {
  constructor() {
    this.cards = [];
    this.currentIndex = 0;
    this.originalOrder = [];
  }

  /**
   * Load a deck of flashcards from API response
   * @param {Array} cards - Array of flashcard objects with id, question, answer
   */
  loadDeck(cards) {
    this.cards = cards || [];
    this.currentIndex = 0;
    // Store original order for restart functionality
    this.originalOrder = [...this.cards];
  }

  /**
   * Get the current flashcard
   * @returns {Object|null} Current flashcard or null if deck is empty
   */
  getCurrentCard() {
    if (this.cards.length === 0) {
      return null;
    }
    return this.cards[this.currentIndex];
  }

  /**
   * Get progress information
   * @returns {Object} Object with current position and total count
   */
  getProgress() {
    return {
      current: this.cards.length > 0 ? this.currentIndex + 1 : 0,
      total: this.cards.length
    };
  }

  /**
   * Navigate to the next card with wrapping (last → first)
   * Requirements: 3.1, 3.3
   */
  next() {
    if (this.cards.length === 0) {
      return;
    }
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
  }

  /**
   * Navigate to the previous card with wrapping (first → last)
   * Requirements: 3.2, 3.4
   */
  previous() {
    if (this.cards.length === 0) {
      return;
    }
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   * Resets to first card after shuffle
   * Requirements: 6.1, 6.2
   */
  shuffle() {
    if (this.cards.length === 0) {
      return;
    }

    // Fisher-Yates shuffle algorithm
    const shuffled = [...this.cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    this.cards = shuffled;
    this.currentIndex = 0;
  }

  /**
   * Restart the deck - reset to first card
   * Preserves current card order (shuffled or original)
   * Requirements: 5.1, 5.3
   */
  restart() {
    this.currentIndex = 0;
  }
}

// Export for use in other modules (if using modules) or make available globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeckManager;
}
