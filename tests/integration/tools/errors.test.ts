/**
 * Integration tests for error tools
 */

import { handleListErrors, handleViewError, handleSearchIssues } from '../../../src/tools/errors';
import { errorsFixture, errorDetailFixture } from '../../fixtures/errors';
import { jest, describe, it, expect } from '@jest/globals';
import { initApiClient } from '../../../src/api/client';

describe('Error Tools', () => {
  it('should have error handler functions', () => {
    expect(typeof handleListErrors).toBe('function');
    expect(typeof handleViewError).toBe('function');
    expect(typeof handleSearchIssues).toBe('function');
  });
});
