/**
 * Integration tests for event tools
 */

import {
  handleListErrorEvents,
  handleViewLatestEvent,
  handleViewEvent,
  handleViewStacktrace,
  handleViewExceptionChain,
} from '../../../src/tools/events';
import { eventsFixture, eventDetailFixture } from '../../fixtures/events';
import { jest, describe, it, expect } from '@jest/globals';
import { initApiClient } from '../../../src/api/client';
import * as stacktraceUtils from '../../../src/utils/stacktrace';
import * as exceptionsUtils from '../../../src/utils/exceptions';

describe('Event Tools', () => {
  it('should have event handler functions', () => {
    expect(typeof handleListErrorEvents).toBe('function');
    expect(typeof handleViewLatestEvent).toBe('function');
    expect(typeof handleViewEvent).toBe('function');
    expect(typeof handleViewStacktrace).toBe('function');
    expect(typeof handleViewExceptionChain).toBe('function');
  });
});
