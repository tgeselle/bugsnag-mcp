/**
 * Test fixtures for errors
 */

export const errorsFixture = [
  {
    id: 'error_12345',
    project_id: 'project_12345',
    error_class: 'TypeError',
    message: "Cannot read property 'foo' of undefined",
    context: 'UserController.getProfile',
    severity: 'error',
    status: 'open',
    events_count: 42,
    first_seen: '2023-01-01T00:00:00Z',
    last_seen: '2023-03-01T00:00:00Z',
    release_stages: ['production'],
    url: 'https://app.bugsnag.com/test-org/test-project/errors/error_12345',
  },
  {
    id: 'error_67890',
    project_id: 'project_12345',
    error_class: 'ReferenceError',
    message: 'someVariable is not defined',
    context: 'PaymentService.processPayment',
    severity: 'warning',
    status: 'fixed',
    events_count: 7,
    first_seen: '2023-02-01T00:00:00Z',
    last_seen: '2023-02-15T00:00:00Z',
    release_stages: ['staging'],
    url: 'https://app.bugsnag.com/test-org/test-project/errors/error_67890',
  },
];

export const errorDetailFixture = {
  id: 'error_12345',
  project_id: 'project_12345',
  error_class: 'TypeError',
  message: "Cannot read property 'foo' of undefined",
  context: 'UserController.getProfile',
  severity: 'error',
  status: 'open',
  events_count: 42,
  first_seen: '2023-01-01T00:00:00Z',
  last_seen: '2023-03-01T00:00:00Z',
  release_stages: ['production'],
  url: 'https://app.bugsnag.com/test-org/test-project/errors/error_12345',
  app_versions: ['1.0.0', '1.1.0', '1.2.0'],
  resolved_in_version: null,
  users_affected: 15,
  user_impact: {
    percentage_of_sessions: 0.5,
    percentage_of_users: 1.2,
  },
  comments_count: 3,
  assignee: {
    id: 'user_12345',
    name: 'Test User',
    email: 'test@example.com',
  },
};
