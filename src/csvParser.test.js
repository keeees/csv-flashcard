import { describe, it, expect } from 'vitest';
import { parseCSV, validateCSVStructure, serializeToCSV } from './csvParser.js';

describe('CSV Parser', () => {
  describe('parseCSV', () => {
    it('should parse valid CSV with two columns', () => {
      const csv = '问题1,答案1\n问题2,答案2';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, question: '问题1', answer: '答案1' });
      expect(result[1]).toEqual({ id: 2, question: '问题2', answer: '答案2' });
    });

    it('should handle Chinese characters correctly', () => {
      const csv = '19世纪初拉丁美洲独立运动的背景之一是什么？,西班牙、葡萄牙残酷的殖民统治引发了拉丁美洲人民的强烈不满。';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(1);
      expect(result[0].question).toBe('19世纪初拉丁美洲独立运动的背景之一是什么？');
      expect(result[0].answer).toBe('西班牙、葡萄牙残酷的殖民统治引发了拉丁美洲人民的强烈不满。');
    });

    it('should skip empty rows', () => {
      const csv = '问题1,答案1\n\n问题2,答案2\n\n';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0].question).toBe('问题1');
      expect(result[1].question).toBe('问题2');
    });

    it('should handle trailing commas', () => {
      const csv = '问题1,答案1,\n问题2,答案2,';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0].question).toBe('问题1');
      expect(result[0].answer).toBe('答案1');
    });

    it('should handle quoted fields with commas', () => {
      const csv = '"问题, with comma",答案1\n问题2,"答案, with comma"';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0].question).toBe('问题, with comma');
      expect(result[0].answer).toBe('答案1');
      expect(result[1].question).toBe('问题2');
      expect(result[1].answer).toBe('答案, with comma');
    });

    it('should handle escaped quotes', () => {
      const csv = '"问题 ""quoted""",答案1';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(1);
      expect(result[0].question).toBe('问题 "quoted"');
    });

    it('should throw error for empty CSV', () => {
      expect(() => parseCSV('')).toThrow('The selected file is empty');
      expect(() => parseCSV('   ')).toThrow('The selected file is empty');
    });

    it('should throw error for CSV with less than 2 columns', () => {
      const csv = '只有一列';
      expect(() => parseCSV(csv)).toThrow('Invalid CSV format');
    });

    it('should throw error for malformed CSV', () => {
      const csv = 'question1\nquestion2';
      expect(() => parseCSV(csv)).toThrow('Invalid CSV format');
    });

    it('should handle different line endings (CRLF)', () => {
      const csv = '问题1,答案1\r\n问题2,答案2';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
    });

    it('should skip rows with only whitespace in both columns', () => {
      const csv = '问题1,答案1\n  ,  \n问题2,答案2';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0].question).toBe('问题1');
      expect(result[1].question).toBe('问题2');
    });
  });

  describe('validateCSVStructure', () => {
    it('should return true for valid CSV', () => {
      const csv = '问题1,答案1\n问题2,答案2';
      expect(validateCSVStructure(csv)).toBe(true);
    });

    it('should return false for invalid CSV', () => {
      const csv = '只有一列';
      expect(validateCSVStructure(csv)).toBe(false);
    });

    it('should return false for empty CSV', () => {
      expect(validateCSVStructure('')).toBe(false);
    });
  });

  describe('serializeToCSV', () => {
    it('should serialize flashcards to CSV format', () => {
      const flashcards = [
        { question: '问题1', answer: '答案1' },
        { question: '问题2', answer: '答案2' }
      ];
      const csv = serializeToCSV(flashcards);
      
      expect(csv).toBe('问题1,答案1\n问题2,答案2');
    });

    it('should escape fields with commas', () => {
      const flashcards = [
        { question: '问题, with comma', answer: '答案1' }
      ];
      const csv = serializeToCSV(flashcards);
      
      expect(csv).toBe('"问题, with comma",答案1');
    });

    it('should escape quotes in fields', () => {
      const flashcards = [
        { question: '问题 "quoted"', answer: '答案1' }
      ];
      const csv = serializeToCSV(flashcards);
      
      expect(csv).toBe('"问题 ""quoted""",答案1');
    });
  });
});
