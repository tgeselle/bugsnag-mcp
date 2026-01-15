/**
 * Project-related tool handlers
 */

import { initApiClient } from '../api/client.js';
import { fetchAllPages } from '../api/pagination.js';
import { ToolHandler } from '../types/index.js';

/**
 * Handle the list_projects tool
 */
export const handleListProjects: ToolHandler = async args => {
  const organizationId = args.organization_id;

  const client = initApiClient();
  const projects = await fetchAllPages(
    client,
    `/organizations/${organizationId}/projects`,
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(projects, null, 2),
      },
    ],
  };
};
