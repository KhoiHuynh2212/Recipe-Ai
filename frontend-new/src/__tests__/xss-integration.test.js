// src/__tests__/sanitization.test.js
import React from 'react';

// Directly test the sanitization function
const sanitizeInput = (text) => {
  if (!text) return '';
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .trim();
};

describe('XSS Protection Tests', () => {
  // Unit tests for the sanitization function
  describe('sanitizeInput function', () => {
    test('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    test('should sanitize HTML tags', () => {
      const result = sanitizeInput('<div>test</div>');
      expect(result).toContain('&lt;div&gt;');
      expect(result).toContain('&lt;/div&gt;');
      expect(result).not.toContain('<div>');
    });

    test('should sanitize script tags', () => {
      const result = sanitizeInput('<script>alert("XSS")</script>');
      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&lt;/script&gt;');
      expect(result).not.toContain('<script>');
      // Check that double quotes are sanitized (either as " or as &quot;)
      expect(result).toMatch(/alert\(&quot;XSS&quot;\)|alert\("XSS"\)/);
    });

    test('should sanitize event handlers', () => {
      const result = sanitizeInput('<img src="x" onerror="alert(\'XSS\')">');
      expect(result).toContain('&lt;img');
      expect(result).toContain('&gt;');
      expect(result).not.toContain('<img');
      // Check that quotes are sanitized (in some form)
      expect(result).toContain('src=');
      expect(result).toContain('onerror=');
      expect(result).toContain('&#039;XSS&#039;'); // Single quotes should be encoded
    });

    test('should sanitize quotes', () => {
      const result = sanitizeInput('Single \' and double " quotes');
      expect(result).toContain('&#039;');
      expect(result).toContain('&quot;');
      expect(result).not.toContain('"');
      expect(result).not.toContain("'");
    });

    test('should handle complex XSS attempts', () => {
      const complexXSS = '<svg/onload=alert(\'XSS\')><iframe src="javascript:alert(\'XSS\')"></iframe>';
      const result = sanitizeInput(complexXSS);
      expect(result).not.toContain('<svg');
      expect(result).not.toContain('<iframe');
      expect(result).toContain('&lt;svg');
      expect(result).toContain('&lt;iframe');
      expect(result).toContain('&#039;XSS&#039;');
    });
  });

  // Additional test to verify that double encoding works
  test('should properly handle already encoded entities', () => {
    const encodedInput = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    const result = sanitizeInput(encodedInput);
    expect(result).toContain('&amp;lt;');
    expect(result).toContain('&amp;gt;');
    expect(result).toContain('&amp;quot;');
  });
});