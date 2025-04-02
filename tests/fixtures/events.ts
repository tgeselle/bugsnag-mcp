/**
 * Test fixtures for events
 */

import { Exception, StacktraceFrame } from '../../src/types/index';

// Sample stacktrace frames
export const stacktraceFramesFixture: StacktraceFrame[] = [
  {
    file: '/app/src/controllers/UserController.js',
    lineNumber: 42,
    columnNumber: 10,
    method: 'UserController.getProfile',
    inProject: true,
    code: {
      '40': '  getProfile(userId) {',
      '41': '    try {',
      '42': '      const user = this.userService.findById(userId);',
      '43': '      return user.profile;',
      '44': '    } catch (error) {',
    },
  },
  {
    file: '/app/src/services/UserService.js',
    lineNumber: 25,
    columnNumber: 12,
    method: 'UserService.findById',
    inProject: true,
    code: {
      '23': '  findById(id) {',
      '24': '    const user = this.userRepository.findById(id);',
      '25': '    return user;',
      '26': '    // Note: No null check here',
      '27': '  }',
    },
  },
  {
    file: '/app/node_modules/some-library/index.js',
    lineNumber: 157,
    columnNumber: 5,
    method: 'Repository.findById',
    inProject: false,
  },
];

// Sample exceptions
export const exceptionsFixture: Exception[] = [
  {
    errorClass: 'TypeError',
    message: "Cannot read property 'foo' of undefined",
    stacktrace: stacktraceFramesFixture,
  },
  {
    errorClass: 'Error',
    message: 'User not found',
    stacktrace: [],
  },
];

// Sample events
export const eventsFixture = [
  {
    id: 'event_12345',
    error_id: 'error_12345',
    received_at: '2023-03-01T00:00:00Z',
    user: {
      id: 'user_123',
      email: 'user@example.com',
      name: 'Test User',
    },
    app: {
      version: '1.2.0',
      release_stage: 'production',
    },
    device: {
      hostname: 'web-server-01',
      os_name: 'Linux',
      os_version: 'Ubuntu 20.04',
    },
    exceptions: exceptionsFixture,
  },
  {
    id: 'event_67890',
    error_id: 'error_12345',
    received_at: '2023-02-15T00:00:00Z',
    user: {
      id: 'user_456',
      email: 'another@example.com',
      name: 'Another User',
    },
    app: {
      version: '1.1.0',
      release_stage: 'production',
    },
    device: {
      hostname: 'web-server-02',
      os_name: 'Linux',
      os_version: 'Ubuntu 20.04',
    },
    exceptions: [exceptionsFixture[0]],
  },
];

// Detailed event
export const eventDetailFixture = {
  id: 'event_12345',
  error_id: 'error_12345',
  received_at: '2023-03-01T00:00:00Z',
  user: {
    id: 'user_123',
    email: 'user@example.com',
    name: 'Test User',
  },
  app: {
    version: '1.2.0',
    release_stage: 'production',
    type: 'nodejs',
    duration: 152,
    dsym_uuid: null,
  },
  device: {
    hostname: 'web-server-01',
    os_name: 'Linux',
    os_version: 'Ubuntu 20.04',
    memory: {
      total: 8589934592,
      free: 4294967296,
    },
    runtime_versions: {
      node: '16.14.0',
    },
  },
  context: 'UserController.getProfile',
  exceptions: exceptionsFixture,
  breadcrumbs: [
    {
      timestamp: '2023-03-01T00:00:00Z',
      name: 'Request started',
      type: 'navigation',
      metadata: {
        path: '/api/users/123/profile',
        method: 'GET',
      },
    },
    {
      timestamp: '2023-03-01T00:00:00Z',
      name: 'Database query',
      type: 'process',
      metadata: {
        query: 'SELECT * FROM users WHERE id = ?',
        params: ['123'],
      },
    },
  ],
  request: {
    url: 'https://api.example.com/users/123/profile',
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'content-type': 'application/json',
    },
  },
  metaData: {
    custom: {
      userId: '123',
      subscription: 'premium',
    },
    request: {
      params: {
        id: '123',
      },
    },
  },
};
