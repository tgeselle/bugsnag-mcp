/**
 * Organization-related tool handlers
 */

import { initApiClient } from '../api/client.js';
import { ToolHandler } from '../types/index.js';

/**
 * Handle the list_organizations tool
 */
export const handleListOrganizations: ToolHandler = async args => {
  const client = initApiClient();
  const response = await client.get('/user/organizations');

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
};
