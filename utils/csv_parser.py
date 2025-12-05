"""CSV parser module for loading flashcard data from CSV files."""

import csv
from typing import List
from io import StringIO
from models.flashcard import Flashcard


class CSVParseError(Exception):
    """Exception raised when CSV parsing fails."""
    pass


def parse_csv(csv_content: str) -> List[Flashcard]:
    """Parse CSV content into a list of Flashcard objects.
    
    This function parses CSV content where the first column is the question
    and the second column is the answer. It handles UTF-8 encoding, filters
    out empty rows, and validates the CSV structure.
    
    Args:
        csv_content: String containing CSV data with questions and answers
        
    Returns:
        List of Flashcard objects parsed from the CSV content
        
    Raises:
        CSVParseError: If the CSV is malformed or doesn't have at least 2 columns
        
    Examples:
        >>> csv_data = "What is 2+2?,4\\nWhat is Python?,A programming language"
        >>> cards = parse_csv(csv_data)
        >>> len(cards)
        2
    """
    if not csv_content or not csv_content.strip():
        return []
    
    flashcards = []
    csv_file = StringIO(csv_content)
    
    try:
        # Use csv.reader to handle edge cases like quotes, commas in fields, etc.
        reader = csv.reader(csv_file)
        
        for row_num, row in enumerate(reader, start=1):
            # Skip empty rows (rows with no content or only whitespace)
            if not row or all(not cell.strip() for cell in row):
                continue
            
            # Validate that the row has at least 2 columns
            if len(row) < 2:
                raise CSVParseError(
                    f"Row {row_num} has fewer than 2 columns. "
                    f"CSV must have at least two columns for questions and answers."
                )
            
            # Extract question and answer (first two columns)
            question = row[0].strip()
            answer = row[1].strip()
            
            # Skip rows where both question and answer are empty
            if not question and not answer:
                continue
            
            # Create flashcard with 1-based ID
            flashcard = Flashcard(
                id=len(flashcards) + 1,
                question=question,
                answer=answer
            )
            flashcards.append(flashcard)
    
    except csv.Error as e:
        raise CSVParseError(f"Failed to parse CSV: {str(e)}")
    
    return flashcards


def validate_csv_structure(csv_content: str) -> bool:
    """Validate that CSV content has the proper structure.
    
    Checks that the CSV has at least 2 columns in each non-empty row.
    
    Args:
        csv_content: String containing CSV data to validate
        
    Returns:
        True if the CSV structure is valid, False otherwise
    """
    if not csv_content or not csv_content.strip():
        return True  # Empty content is valid (will result in empty deck)
    
    try:
        csv_file = StringIO(csv_content)
        reader = csv.reader(csv_file)
        
        for row in reader:
            # Skip empty rows
            if not row or all(not cell.strip() for cell in row):
                continue
            
            # Check if row has at least 2 columns
            if len(row) < 2:
                return False
        
        return True
    
    except csv.Error:
        return False


def load_csv_file(filepath: str) -> List[Flashcard]:
    """Load and parse a CSV file from the filesystem.
    
    Reads the file with UTF-8 encoding to support international characters
    (e.g., Chinese text) and parses it into Flashcard objects.
    
    Args:
        filepath: Path to the CSV file to load
        
    Returns:
        List of Flashcard objects parsed from the file
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        PermissionError: If the file cannot be read
        CSVParseError: If the CSV content is malformed
        UnicodeDecodeError: If the file is not UTF-8 encoded
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            csv_content = f.read()
        
        return parse_csv(csv_content)
    
    except FileNotFoundError:
        raise FileNotFoundError(f"CSV file not found: {filepath}")
    
    except PermissionError:
        raise PermissionError(f"Permission denied reading file: {filepath}")
    
    except UnicodeDecodeError as e:
        raise UnicodeDecodeError(
            e.encoding, e.object, e.start, e.end,
            f"Unable to read file. Please ensure the file is UTF-8 encoded."
        )
