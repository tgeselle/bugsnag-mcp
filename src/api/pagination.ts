/**
 * Helpers for paginated Bugsnag API endpoints.
 */

import { AxiosInstance } from 'axios';

const DEFAULT_PER_PAGE = 100;

export async function fetchAllPages<T>(
  client: AxiosInstance,
  path: string,
  params: Record<string, unknown> = {},
  perPage: number = DEFAULT_PER_PAGE,
): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (true) {
    const response = await client.get<T[]>(path, {
      params: {
        ...params,
        page,
        per_page: perPage,
      },
    });

    const data = response.data;
    if (!Array.isArray(data)) {
      throw new Error(`Expected array response from ${path}`);
    }

    results.push(...data);

    if (data.length < perPage) {
      break;
    }

    page += 1;
  }

  return results;
}
