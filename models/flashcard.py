"""Flashcard data model for the flashcard web application."""

from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class Flashcard:
    """Represents a single flashcard with a question and answer.
    
    Attributes:
        id: Unique identifier for the flashcard
        question: The question text displayed on the front of the card
        answer: The answer text displayed on the back of the card
    """
    id: int
    question: str
    answer: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize the flashcard to a dictionary for JSON serialization.
        
        Returns:
            Dictionary containing id, question, and answer fields
        """
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Flashcard':
        """Create a Flashcard instance from a dictionary.
        
        Args:
            data: Dictionary containing id, question, and answer fields
            
        Returns:
            New Flashcard instance
            
        Raises:
            KeyError: If required fields are missing from the dictionary
            TypeError: If field types are incorrect
        """
        return cls(
            id=int(data['id']),
            question=str(data['question']),
            answer=str(data['answer'])
        )
