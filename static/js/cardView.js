/**
 * CardView class manages the display and flip state of flashcards
 * Handles rendering card content and flip animations
 */
class CardView {
  constructor(cardContainerElement) {
    // DOM elements
    this.cardContainer = cardContainerElement;
    this.card = cardContainerElement.querySelector('.card');
    this.cardFront = cardContainerElement.querySelector('.card-front .card-content p');
    this.cardBack = cardContainerElement.querySelector('.card-back .card-content p');
    
    // State tracking
    this.isFlipped = false;
    this.isAnimating = false;
    
    // Animation duration (matches CSS transition time)
    this.animationDuration = 600; // milliseconds
  }
  
  /**
   * Render a flashcard with the given content
   * @param {Object} card - Flashcard object with question and answer properties
   * @param {boolean} showQuestion - Whether to show the question side (true) or answer side (false)
   */
  render(card, showQuestion = true) {
    if (!card) {
      this.cardFront.textContent = 'No card available';
      this.cardBack.textContent = '';
      return;
    }
    
    // Update card content
    this.cardFront.textContent = card.question;
    this.cardBack.textContent = card.answer;
    
    // Set flip state based on showQuestion parameter
    this.isFlipped = !showQuestion;
    this.cardContainer.setAttribute('data-flipped', this.isFlipped.toString());
    
    // Update ARIA label for accessibility
    const side = showQuestion ? 'question' : 'answer';
    this.card.setAttribute('data-side', side);
    this.card.setAttribute('aria-label', `Flashcard showing ${side} - click or press space to flip`);
  }
  
  /**
   * Flip the card to show the opposite side
   * Toggles between question and answer with animation
   */
  flip() {
    // Prevent flip if animation is already in progress
    if (this.isAnimating) {
      return;
    }
    
    // Set animating flag
    this.isAnimating = true;
    
    // Toggle flip state
    this.isFlipped = !this.isFlipped;
    
    // Trigger CSS 3D transform by updating data attribute
    this.cardContainer.setAttribute('data-flipped', this.isFlipped.toString());
    
    // Update ARIA label for accessibility
    const side = this.isFlipped ? 'answer' : 'question';
    this.card.setAttribute('data-side', side);
    this.card.setAttribute('aria-label', `Flashcard showing ${side} - click or press space to flip`);
    
    // Clear animating flag after animation completes
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }
  
  /**
   * Check if a flip animation is currently in progress
   * @returns {boolean} True if animation is in progress, false otherwise
   */
  isFlipping() {
    return this.isAnimating;
  }
}

// Export for use in other modules (if using ES6 modules)
// For now, CardView is available globally
