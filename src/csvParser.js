/**
 * CSV Parser Module
 * Parses CSV files containing flashcard data (question, answer pairs)
 */

/**
 * Parses CSV content into an array of flashcard objects
 * @param {string} csvContent - The raw CSV content as a string
 * @returns {Array<{id: number, question: string, answer: string}>} Array of flashcard objects
 * @throws {Error} If CSV structure is invalid
 */
export function parseCSV(csvContent) {
  // Validate input
  if (typeof csvContent !== 'string') {
    throw new Error('CSV content must be a string');
  }

  // Handle empty content
  if (csvContent.trim() === '') {
    throw new Error('The selected file is empty. Please choose a file with flashcard data.');
  }

  // Split into rows, handling different line endings
  const rows = csvContent.split(/\r?\n/);
  
  const flashcards = [];
  let id = 1;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();
    
    // Skip empty rows
    if (row === '') {
      continue;
    }

    // Parse the row - handle basic CSV parsing
    const columns = parseCSVRow(row);

    // Validate structure - must have at least 2 columns
    if (columns.length < 2) {
      throw new Error('Invalid CSV format. Please ensure the file has two columns: question and answer.');
    }

    const question = columns[0].trim();
    const answer = columns[1].trim();

    // Skip rows where both question and answer are empty
    if (question === '' && answer === '') {
      continue;
    }

    // Create flashcard object
    flashcards.push({
      id: id++,
      question: question,
      answer: answer
    });
  }

  // Check if we got any valid flashcards
  if (flashcards.length === 0) {
    throw new Error('The selected file is empty. Please choose a file with flashcard data.');
  }

  return flashcards;
}

/**
 * Parses a single CSV row, handling quotes and special characters
 * @param {string} row - A single row from the CSV
 * @returns {Array<string>} Array of column values
 */
function parseCSVRow(row) {
  const columns = [];
  let currentColumn = '';
  let insideQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote - add a single quote to the column
        currentColumn += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Column separator - save current column and start new one
      columns.push(currentColumn);
      currentColumn = '';
    } else {
      // Regular character - add to current column
      currentColumn += char;
    }
  }

  // Add the last column
  columns.push(currentColumn);

  return columns;
}

/**
 * Validates CSV structure without parsing the entire content
 * @param {string} csvContent - The raw CSV content as a string
 * @returns {boolean} True if structure is valid, false otherwise
 */
export function validateCSVStructure(csvContent) {
  try {
    parseCSV(csvContent);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Serializes flashcards back to CSV format (for testing round-trip)
 * @param {Array<{question: string, answer: string}>} flashcards - Array of flashcard objects
 * @returns {string} CSV formatted string
 */
export function serializeToCSV(flashcards) {
  return flashcards.map(card => {
    // Escape quotes and wrap in quotes if necessary
    const question = escapeCSVField(card.question);
    const answer = escapeCSVField(card.answer);
    return `${question},${answer}`;
  }).join('\n');
}

/**
 * Escapes a CSV field by wrapping in quotes if it contains special characters
 * @param {string} field - The field to escape
 * @returns {string} Escaped field
 */
function escapeCSVField(field) {
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
