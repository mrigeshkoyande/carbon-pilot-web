import { describe, it, expect } from 'vitest';
import { sanitizeText, getErrorMessage } from './firebase';

describe('Security: sanitizeText', () => {
  it('should remove HTML tags to prevent XSS', () => {
    const input = '<script>alert("xss")</script>Hello <b onmouseover="alert()">World</b>';
    const result = sanitizeText(input);
    expect(result).toBe('alert(&quot;xss&quot;)Hello World');
  });

  it('should escape dangerous characters and aggressively strip tags', () => {
    // The sanitizeText function uses /<[^>]*>/g to strip anything resembling a tag FIRST.
    // So `< c >` is completely removed, leaving the rest to be escaped.
    const input = 'a & b < c > d " e \' f / g';
    const result = sanitizeText(input);
    expect(result).toBe('a &amp; b  d &quot; e &#x27; f &#x2F; g');
  });

  it('should handle empty or undefined inputs gracefully', () => {
    expect(sanitizeText('')).toBe('');
    expect(sanitizeText(undefined as unknown as string)).toBe('');
    expect(sanitizeText(null as unknown as string)).toBe('');
  });
});

describe('UX/Security: getErrorMessage', () => {
  it('should map auth/user-not-found to a friendly message', () => {
    expect(getErrorMessage({ code: 'auth/user-not-found' })).toBe('Invalid email or password combination.');
  });

  it('should map auth/email-already-in-use to a friendly message', () => {
    expect(getErrorMessage({ code: 'auth/email-already-in-use' })).toBe('An account with this email address already exists.');
  });

  it('should return default message for unknown errors', () => {
    expect(getErrorMessage({ code: 'unknown-code' })).toBe('An unexpected validation error occurred.');
  });

  it('should extract error.message if code is missing but message exists', () => {
    expect(getErrorMessage({ message: 'Custom backend error' })).toBe('Custom backend error');
  });

  it('should handle strings directly', () => {
    expect(getErrorMessage('String error')).toBe('String error');
  });
});
