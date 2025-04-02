/**
 * Tests for exception utility functions
 */

import { formatExceptionChain } from '../../../src/utils/exceptions';
import { Exception } from '../../../src/types/index';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('Exception Utilities', () => {
  describe('formatExceptionChain', () => {
    it('should format a single exception', () => {
      const exceptions: Exception[] = [
        {
          errorClass: 'Error',
          message: 'Something went wrong'
        }
      ];
      
      const result = formatExceptionChain(exceptions);
      expect(result).toContain('# Primary Exception: Error: Something went wrong');
    });
    
    it('should format multiple exceptions in a chain', () => {
      const exceptions: Exception[] = [
        {
          errorClass: 'TypeError',
          message: 'Cannot read property of undefined'
        },
        {
          errorClass: 'Error',
          message: 'User not found'
        },
        {
          errorClass: 'DatabaseError',
          message: 'Connection failed'
        }
      ];
      
      const result = formatExceptionChain(exceptions);
      
      expect(result).toContain('# Primary Exception: TypeError: Cannot read property of undefined');
      expect(result).toContain('└─ Caused by: Error: User not found');
      expect(result).toContain('    └─ Caused by: DatabaseError: Connection failed');
    });
    
    it('should handle empty exception array', () => {
      const exceptions: Exception[] = [];
      
      const result = formatExceptionChain(exceptions);
      expect(result).toBe('No exceptions available.');
    });
    
    it('should handle null or undefined input', () => {
      // @ts-ignore - Testing null input
      const result1 = formatExceptionChain(null);
      expect(result1).toBe('No exceptions available.');
      
      // @ts-ignore - Testing undefined input
      const result2 = formatExceptionChain(undefined);
      expect(result2).toBe('No exceptions available.');
    });
  });
});