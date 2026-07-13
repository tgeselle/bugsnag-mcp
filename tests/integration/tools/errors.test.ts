/**
 * Integration tests for error tools
 */

import { jest, describe, it, expect } from '@jest/globals';

const mockGet = jest.fn();

jest.unstable_mockModule('../src/api/client', () => ({
  initApiClient: jest.fn(() => ({ get: mockGet })),
}));

const { handleListErrors, handleViewError, handleSearchIssues } = await import(
  '../../../src/tools/errors.js'
);

describe('Error Tools', () => {
  it('should have error handler functions', () => {
    expect(typeof handleListErrors).toBe('function');
    expect(typeof handleViewError).toBe('function');
    expect(typeof handleSearchIssues).toBe('function');
  });
});
