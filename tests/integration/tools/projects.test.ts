/**
 * Integration tests for project tools
 */

import { handleListProjects } from '../../../src/tools/projects';
import { projectsFixture } from '../../fixtures/projects';
import { jest, describe, it, expect } from '@jest/globals';
import { initApiClient } from '../../../src/api/client';

describe('Project Tools', () => {
  it('should have a handleListProjects function', () => {
    expect(typeof handleListProjects).toBe('function');
  });
});