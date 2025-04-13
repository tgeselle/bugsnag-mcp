/**
 * Event-related tool handlers
 */

import { initApiClient } from '../api/client.js';
import { ToolHandler } from '../types/index.js';
import { formatStacktrace } from '../utils/stacktrace.js';
import { formatExceptionChain } from '../utils/exceptions.js';

/**
 * Handle the list_error_events tool
 */
export const handleListErrorEvents: ToolHandler = async args => {
  const projectId = args.project_id;
  const errorId = args.error_id;
  const limit = args.limit || 10;

  const client = initApiClient();
  const response = await client.get(`/projects/${projectId}/errors/${errorId}/events`, {
    params: { per_page: limit },
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
};

/**
 * Handle the view_latest_event tool
 */
export const handleViewLatestEvent: ToolHandler = async args => {
  const errorId = args.error_id;

  const client = initApiClient();
  const response = await client.get(`/errors/${errorId}/latest_event`);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
};

/**
 * Handle the view_event tool
 */
export const handleViewEvent: ToolHandler = async args => {
  const projectId = args.project_id;
  const eventId = args.event_id;

  const client = initApiClient();
  const response = await client.get(`/projects/${projectId}/events/${eventId}`);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
};

/**
 * Handle the view_stacktrace tool
 */
export const handleViewStacktrace: ToolHandler = async args => {
  const projectId = args.project_id;
  const eventId = args.event_id;
  const includeCode = args.include_code !== false; // Default to true

  const client = initApiClient();
  const response = await client.get(`/projects/${projectId}/events/${eventId}`);
  const event = response.data;

  if (!event.exceptions || event.exceptions.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: 'No stacktrace information available for this event.',
        },
      ],
    };
  }

  // Format the stacktrace of the primary exception
  const primaryException = event.exceptions[0];
  const formattedStacktrace = formatStacktrace(primaryException.stacktrace, includeCode);

  return {
    content: [
      {
        type: 'text',
        text: `# Stacktrace for ${primaryException.errorClass}: ${primaryException.message}\n\n${formattedStacktrace}`,
      },
    ],
  };
};

/**
 * Handle the view_exception_chain tool
 */
export const handleViewExceptionChain: ToolHandler = async args => {
  const projectId = args.project_id;
  const eventId = args.event_id;

  const client = initApiClient();
  const response = await client.get(`/projects/${projectId}/events/${eventId}`);
  const event = response.data;

  if (!event.exceptions || event.exceptions.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: 'No exception information available for this event.',
        },
      ],
    };
  }

  const formattedChain = formatExceptionChain(event.exceptions);

  return {
    content: [
      {
        type: 'text',
        text: `# Exception Chain\n\n${formattedChain}`,
      },
    ],
  };
};

/**
 * Handle the view_tabs tool
 */
export const handleViewTabs: ToolHandler = async args => {
  const projectId = args.project_id;
  const eventId = args.event_id;
  const includeCode = args.include_code !== false; // Default to true

  const client = initApiClient();
  const response = await client.get(`/projects/${projectId}/events/${eventId}`);
  const event = response.data;

  // Organize the data into logical sections/tabs
  const formattedEvent: any = {
    // Basic event info
    id: event.id,
    error_id: event.error_id,
    received_at: event.received_at,
    unhandled: event.unhandled,
    severity: event.severity,
    context: event.context,

    // Tab data
    app: event.app || null,
    device: event.device || null,
    user: event.user || null,
    request: event.request || null,
    breadcrumbs: event.breadcrumbs || [],
    metaData: event.metaData || {},

    // Stacktrace and exceptions
    exceptions: event.exceptions || [],
    threads: event.threads || [],
  };

  // Format the stacktrace if available
  let stacktraceText = '';
  if (event.exceptions && event.exceptions.length > 0) {
    const primaryException = event.exceptions[0];
    stacktraceText = formatStacktrace(primaryException.stacktrace, includeCode);

    // Add formatted stacktrace as a separate field
    formattedEvent.formatted_stacktrace = `# Stacktrace for ${primaryException.errorClass}: ${primaryException.message}\n\n${stacktraceText}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(formattedEvent, null, 2),
      },
    ],
  };
};
