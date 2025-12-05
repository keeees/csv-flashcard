"""
File manager module for handling CSV file operations.

This module provides functions to list and read CSV files from the data directory,
with proper error handling and security validation.
"""

import os
from pathlib import Path
from typing import List


def list_csv_files(directory: str = "data") -> List[str]:
    """
    List all CSV files in the specified directory.
    
    Args:
        directory: Path to the directory to scan (default: "data")
        
    Returns:
        List of CSV filenames (without path, just filenames)
        
    Raises:
        FileNotFoundError: If the directory does not exist
        PermissionError: If the directory cannot be accessed
    """
    try:
        # Convert to Path object for better path handling
        dir_path = Path(directory)
        
        # Check if directory exists
        if not dir_path.exists():
            raise FileNotFoundError(f"Directory '{directory}' does not exist")
        
        # Check if it's actually a directory
        if not dir_path.is_dir():
            raise NotADirectoryError(f"'{directory}' is not a directory")
        
        # List all CSV files
        csv_files = [
            f.name for f in dir_path.iterdir() 
            if f.is_file() and f.suffix.lower() == '.csv'
        ]
        
        # Sort for consistent ordering
        return sorted(csv_files)
        
    except PermissionError as e:
        raise PermissionError(f"Permission denied accessing directory '{directory}'") from e


def read_file(filepath: str, base_directory: str = "data") -> str:
    """
    Read file content with UTF-8 encoding and path validation.
    
    This function validates the filepath to prevent directory traversal attacks
    and ensures the file is within the allowed base directory.
    
    Args:
        filepath: Name of the file to read (just filename, not full path)
        base_directory: Base directory where files are stored (default: "data")
        
    Returns:
        File content as string
        
    Raises:
        FileNotFoundError: If the file does not exist
        PermissionError: If the file cannot be accessed
        ValueError: If the filepath attempts directory traversal
        UnicodeDecodeError: If the file cannot be decoded as UTF-8
    """
    # Validate filepath to prevent directory traversal attacks
    # Check for suspicious patterns
    if '..' in filepath or filepath.startswith('/') or filepath.startswith('\\'):
        raise ValueError(f"Invalid filepath: '{filepath}'. Directory traversal not allowed.")
    
    # Additional check for absolute paths on Windows
    if os.path.isabs(filepath):
        raise ValueError(f"Invalid filepath: '{filepath}'. Absolute paths not allowed.")
    
    # Construct the full path
    base_path = Path(base_directory).resolve()
    full_path = (base_path / filepath).resolve()
    
    # Verify the resolved path is still within the base directory
    # This prevents symlink attacks and other path manipulation
    try:
        full_path.relative_to(base_path)
    except ValueError:
        raise ValueError(
            f"Invalid filepath: '{filepath}'. Path must be within '{base_directory}' directory."
        )
    
    # Check if file exists
    if not full_path.exists():
        raise FileNotFoundError(f"File '{filepath}' not found in '{base_directory}' directory")
    
    # Check if it's actually a file
    if not full_path.is_file():
        raise ValueError(f"'{filepath}' is not a file")
    
    # Read file with UTF-8 encoding
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except PermissionError as e:
        raise PermissionError(f"Permission denied reading file '{filepath}'") from e
    except UnicodeDecodeError as e:
        raise UnicodeDecodeError(
            e.encoding, e.object, e.start, e.end,
            f"File '{filepath}' is not valid UTF-8. Please ensure the file is UTF-8 encoded."
        )
