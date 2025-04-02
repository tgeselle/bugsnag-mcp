/**
 * Integration tests for resource handlers
 */

import { handleResourceRequest, listResources } from '../../../src/resources/index';
import { organizationsFixture } from '../../fixtures/organizations';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types';
import { jest, describe, it, expect } from '@jest/globals';
import { initApiClient } from '../../../src/api/client';

describe('Resource Handlers', () => {
  it('should have resource handler functions', () => {
    expect(typeof handleResourceRequest).toBe('function');
    expect(typeof listResources).toBe('function');
  });
});