/**
 * Utility functions for formatting stacktraces
 */

import { StacktraceFrame } from '../types/index.js';

/**
 * Format a stacktrace with source code context
 */
export function formatStacktrace(stacktrace: StacktraceFrame[], includeCode: boolean): string {
  if (!stacktrace || stacktrace.length === 0) {
    return 'No stacktrace frames available.';
  }

  let result = '';

  stacktrace.forEach((frame, index) => {
    const isProjectCode = isProjectFrame(frame);
    const frameType = isProjectCode ? '[PROJECT]' : '[LIBRARY]';

    result += `${index + 1}. ${frameType} ${frame.file}:${frame.lineNumber}${frame.columnNumber ? `:${frame.columnNumber}` : ''}\n`;
    result += `   Function: ${frame.method || 'unknown'}\n\n`;

    if (includeCode && frame.code) {
      result += formatCodeContext(frame.code, frame.lineNumber || 0);
      result += '\n';
    }
  });

  return result;
}

/**
 * Format source code context with line numbers and highlighting
 */
export function formatCodeContext(code: Record<string, string>, errorLine: number): string {
  let result = '';

  // Sort the line numbers
  const lineNumbers = Object.keys(code)
    .map(Number)
    .sort((a, b) => a - b);

  lineNumbers.forEach(lineNum => {
    const lineContent = code[lineNum.toString()];
    const isErrorLine = lineNum === errorLine;
    const linePrefix = isErrorLine ? ' > ' : '   ';

    result += `   ${linePrefix}${lineNum} | ${lineContent}\n`;
  });

  return result;
}

/**
 * Determine if a stacktrace frame is from project code
 */
export function isProjectFrame(frame: StacktraceFrame): boolean {
  // Check if the frame is marked as in-project by Bugsnag
  if (frame.inProject === true) {
    return true;
  }

  // If not explicitly marked, try to determine based on the file path
  // Typically, project files are not in node_modules or other library directories
  if (frame.file) {
    const isLibraryFile =
      frame.file.includes('node_modules') ||
      frame.file.includes('vendor') ||
      frame.file.startsWith('webpack:');
    return !isLibraryFile;
  }

  return false;
}
