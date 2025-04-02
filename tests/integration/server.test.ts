/**
 * Integration tests for the Bugsnag MCP server
 */

import { BugsnagServer } from '../../src/server';
import { jest, describe, it, expect } from '@jest/globals';

describe('BugsnagServer', () => {
  it('should be able to create a server instance', () => {
    const server = new BugsnagServer();
    expect(server).toBeDefined();
    expect(typeof server.connect).toBe('function');
    expect(typeof server.close).toBe('function');
  });
});
