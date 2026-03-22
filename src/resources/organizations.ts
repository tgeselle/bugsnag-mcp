/**
 * Organization resource handlers
 */

import { fetchAllPages } from '../api/pagination.js';
import { ResourceHandler } from '../types/index.js';

/**
 * Handle organization resources
 */
export const handleOrganizationResource: ResourceHandler = async (uri, client) => {
  const orgMatch = uri.match(/^bugsnag:\/\/organization\/(.+)$/);
  if (!orgMatch) {
    return null;
  }

  const orgId = orgMatch[1];

  // Get organization details
  const orgResponse = await client.get(`/organizations/${orgId}`);

  // Get projects for this organization
  const projects = await fetchAllPages(client, `/organizations/${orgId}/projects`);

  // Combine the data
  const data = {
    organization: orgResponse.data,
    projects,
  };

  return {
    uri,
    mimeType: 'application/json',
    text: JSON.stringify(data, null, 2),
  };
};
