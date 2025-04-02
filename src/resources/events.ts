/**
 * Event resource handlers
 */

import { AxiosInstance } from 'axios';
import { ResourceHandler } from '../types/index.js';

/**
 * Handle event resources
 */
export const handleEventResource: ResourceHandler = async (uri, client) => {
  const eventMatch = uri.match(/^bugsnag:\/\/event\/(.+)\/(.+)$/);
  if (!eventMatch) {
    return null;
  }

  const projectId = eventMatch[1];
  const eventId = eventMatch[2];
  const response = await client.get(`/projects/${projectId}/events/${eventId}`);

  return {
    uri,
    mimeType: 'application/json',
    text: JSON.stringify(response.data, null, 2),
  };
};
