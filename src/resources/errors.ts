/**
 * Error resource handlers
 */

import { AxiosInstance } from 'axios';
import { ResourceHandler } from '../types/index.js';

/**
 * Handle error resources
 */
export const handleErrorResource: ResourceHandler = async (uri, client) => {
  const errorMatch = uri.match(/^bugsnag:\/\/error\/(.+)$/);
  if (!errorMatch) {
    return null;
  }

  const errorId = errorMatch[1];
  const response = await client.get(`/errors/${errorId}`);

  return {
    uri,
    mimeType: 'application/json',
    text: JSON.stringify(response.data, null, 2),
  };
};
