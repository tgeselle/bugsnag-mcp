/**
 * Test fixtures for projects
 */

export const projectsFixture = [
  {
    id: "project_12345",
    name: "Test Project",
    slug: "test-project",
    api_key: "test-api-key",
    type: "nodejs",
    organization_id: "org_12345",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    release_stages: ["production", "staging", "development"],
    url: "https://app.bugsnag.com/test-org/test-project"
  },
  {
    id: "project_67890",
    name: "Another Project",
    slug: "another-project",
    api_key: "another-api-key",
    type: "rails",
    organization_id: "org_12345",
    created_at: "2023-02-01T00:00:00Z",
    updated_at: "2023-02-01T00:00:00Z",
    release_stages: ["production", "staging"],
    url: "https://app.bugsnag.com/test-org/another-project"
  }
];