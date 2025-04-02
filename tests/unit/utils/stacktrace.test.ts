/**
 * Tests for stacktrace utility functions
 */

import { formatStacktrace, formatCodeContext, isProjectFrame } from '../../../src/utils/stacktrace';
import { StacktraceFrame } from '../../../src/types/index';
import { stacktraceFramesFixture } from '../../fixtures/events';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('Stacktrace Utilities', () => {
  describe('formatStacktrace', () => {
    it('should format stacktrace with code context', () => {
      const result = formatStacktrace(stacktraceFramesFixture, true);

      // Check for project frame formatting
      expect(result).toContain('[PROJECT] /app/src/controllers/UserController.js:42:10');
      expect(result).toContain('Function: UserController.getProfile');

      // Check for code context inclusion
      expect(result).toContain('40 | ');
      expect(result).toContain('41 | ');
      expect(result).toContain(' > 42 | ');
      expect(result).toContain('43 | ');
      expect(result).toContain('44 | ');

      // Check for library frame formatting
      expect(result).toContain('[LIBRARY] /app/node_modules/some-library/index.js:157:5');
    });

    it('should format stacktrace without code context', () => {
      const result = formatStacktrace(stacktraceFramesFixture, false);

      // Check for project frame formatting
      expect(result).toContain('[PROJECT] /app/src/controllers/UserController.js:42:10');
      expect(result).toContain('Function: UserController.getProfile');

      // Check that code context is not included
      expect(result).not.toContain('40 | ');
      expect(result).not.toContain('41 | ');
      expect(result).not.toContain(' > 42 | ');

      // Check for library frame formatting
      expect(result).toContain('[LIBRARY] /app/node_modules/some-library/index.js:157:5');
    });

    it('should handle empty stacktrace array', () => {
      const result = formatStacktrace([], true);
      expect(result).toBe('No stacktrace frames available.');
    });

    it('should handle null or undefined input', () => {
      // @ts-ignore - Testing null input
      const result1 = formatStacktrace(null, true);
      expect(result1).toBe('No stacktrace frames available.');

      // @ts-ignore - Testing undefined input
      const result2 = formatStacktrace(undefined, true);
      expect(result2).toBe('No stacktrace frames available.');
    });
  });

  describe('formatCodeContext', () => {
    it('should format code context with line numbers and highlighting', () => {
      const code = {
        '10': 'function example() {',
        '11': '  const x = null;',
        '12': '  return x.property;',
        '13': '}',
      };

      const result = formatCodeContext(code, 12);

      expect(result).toContain('   10 | function example() {');
      expect(result).toContain('   11 |   const x = null;');
      expect(result).toContain(' > 12 |   return x.property;');
      expect(result).toContain('   13 | }');
    });

    it('should handle empty code object', () => {
      const result = formatCodeContext({}, 1);
      expect(result).toBe('');
    });
  });

  describe('isProjectFrame', () => {
    it('should identify frames explicitly marked as in-project', () => {
      const frame: StacktraceFrame = {
        file: '/app/src/index.js',
        lineNumber: 1,
        inProject: true,
      };

      expect(isProjectFrame(frame)).toBe(true);
    });

    it('should identify project frames based on file path', () => {
      const frame: StacktraceFrame = {
        file: '/app/src/index.js',
        lineNumber: 1,
      };

      expect(isProjectFrame(frame)).toBe(true);
    });

    it('should identify library frames based on file path', () => {
      const nodeModulesFrame: StacktraceFrame = {
        file: '/app/node_modules/express/index.js',
        lineNumber: 1,
      };

      const vendorFrame: StacktraceFrame = {
        file: '/app/vendor/jquery.js',
        lineNumber: 1,
      };

      const webpackFrame: StacktraceFrame = {
        file: 'webpack:///./node_modules/react/index.js',
        lineNumber: 1,
      };

      expect(isProjectFrame(nodeModulesFrame)).toBe(false);
      expect(isProjectFrame(vendorFrame)).toBe(false);
      expect(isProjectFrame(webpackFrame)).toBe(false);
    });

    it('should handle frames without file paths', () => {
      const frame: StacktraceFrame = {
        method: 'anonymous',
        lineNumber: 1,
      };

      expect(isProjectFrame(frame)).toBe(false);
    });
  });
});
