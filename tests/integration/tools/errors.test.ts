/**
 * Integration tests for error tools
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { errorsFixture, errorDetailFixture } from '../../fixtures/errors';

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

  describe('handleListErrors', () => {
    beforeEach(() => {
      mockGet.mockReset();
      mockGet.mockResolvedValue({ data: errorsFixture });
    });

    it('passes through sort and direction unchanged when both are provided', async () => {
      await handleListErrors({ project_id: 'project_12345', sort: 'events', direction: 'asc' });

      expect(mockGet).toHaveBeenCalledWith('/projects/project_12345/errors', {
        params: { sort: 'events', direction: 'asc', per_page: 10 },
      });
    });

    it('passes through the filters object unchanged when provided', async () => {
      const filters = { 'error.status': [{ type: 'eq', value: 'open' }] };

      await handleListErrors({ project_id: 'project_12345', filters });

      expect(mockGet).toHaveBeenCalledWith('/projects/project_12345/errors', {
        params: { sort: 'last_seen', direction: 'desc', per_page: 10, filters },
      });
    });

    it('defaults to the real API defaults and sends no filters key when none are given', async () => {
      await handleListErrors({ project_id: 'project_12345' });

      expect(mockGet).toHaveBeenCalledWith('/projects/project_12345/errors', {
        params: { sort: 'last_seen', direction: 'desc', per_page: 10 },
      });
    });

    it('still forwards limit as the real API per_page param', async () => {
      await handleListErrors({ project_id: 'project_12345', limit: 25 });

      expect(mockGet).toHaveBeenCalledWith('/projects/project_12345/errors', {
        params: { sort: 'last_seen', direction: 'desc', per_page: 25 },
      });
    });
  });
});
