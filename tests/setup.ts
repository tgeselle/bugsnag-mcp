// Set up test environment

// Import the jest global
import { jest } from '@jest/globals';

// Set up mocks
jest.mock('../src/api/client', () => {
  const mockGet = jest.fn();
  
  return {
    initApiClient: jest.fn(() => ({
      get: mockGet
    }))
  };
});

// Mock the utility functions
jest.mock('../src/utils/stacktrace', () => ({
  formatStacktrace: jest.fn().mockReturnValue('Formatted stacktrace'),
  formatCodeContext: jest.fn(),
  isProjectFrame: jest.fn()
}));

jest.mock('../src/utils/exceptions', () => ({
  formatExceptionChain: jest.fn().mockReturnValue('Formatted exception chain')
}));