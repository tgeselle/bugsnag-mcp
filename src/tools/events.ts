/**
 * Event-related tool handlers
 */

import { initApiClient } from '../api/client.js';
import { ToolHandler } from '../types/index.js';
import { formatStacktrace } from '../utils/stacktrace.js';
import { formatExceptionChain } from '../utils/exceptions.js';

/**
 * Lightweight interface for Bugsnag exception objects from the API
 */
interface BugsnagException {
  errorClass: string;
  message: string;
  type?: string;
  stacktrace?: Array<Record<string, unknown>>;
}

/**
 * Limit stacktrace frames and return metadata about truncation.
 */
function limitFrames(
  stacktrace: Array<Record<string, unknown>>,
  maxFrames: number,
): { limited: Array<Record<string, unknown>>; total: number; truncated: boolean } {
  const total = stacktrace.length;
  return {
    limited: stacktrace.slice(0, maxFrames),
    total,
    truncated: total > maxFrames,
  };
}

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
  const includeFullDetails = args.include_full_details === true; // Default to false for token efficiency

  const client = initApiClient();
  const response = await client.get(`/errors/${errorId}/latest_event`);
  const event = response.data;

  // If full details requested, return everything (may exceed token limits)
  if (includeFullDetails) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(event, null, 2),
        },
      ],
    };
  }

  // Return a summarized version that's more token-efficient
  const summary = {
    id: event.id,
    error_id: event.error_id,
    received_at: event.received_at,
    unhandled: event.unhandled,
    severity: event.severity,
    context: event.context,

    // Basic info only
    app: event.app ? {
      id: event.app.id,
      name: event.app.name,
      version: event.app.version,
      releaseStage: event.app.releaseStage,
    } : null,

    device: event.device ? {
      osName: event.device.osName,
      osVersion: event.device.osVersion,
      browserName: event.device.browserName,
      browserVersion: event.device.browserVersion,
    } : null,

    user: event.user || null,

    // Exception summary (without full stacktraces)
    exceptions: event.exceptions?.map((exc: BugsnagException) => ({
      errorClass: exc.errorClass,
      message: exc.message,
      type: exc.type,
      stacktraceFrameCount: exc.stacktrace?.length || 0,
    })) || [],

    // Note about full details
    _note: 'This is a summarized version. Set include_full_details=true to get complete event data (may exceed token limits).',
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(summary, null, 2),
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
  const maxFrames = args.max_frames ?? 20; // Default to 20 frames for token efficiency

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
  const primaryException: BugsnagException = event.exceptions[0];
  const { limited, total, truncated } = limitFrames(primaryException.stacktrace || [], maxFrames);

  const formattedStacktrace = formatStacktrace(limited, includeCode);

  let output = `# Stacktrace for ${primaryException.errorClass}: ${primaryException.message}\n\n`;

  if (truncated) {
    output += `⚠️  Showing ${maxFrames} of ${total} frames (use max_frames parameter to adjust)\n\n`;
  }

  output += formattedStacktrace;

  return {
    content: [
      {
        type: 'text',
        text: output,
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
  const maxFrames = args.max_frames ?? 20; // Default to 20 frames for token efficiency
  const maxBreadcrumbs = args.max_breadcrumbs ?? 10; // Default to last 10 breadcrumbs for token efficiency

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

    // Limit breadcrumbs for token efficiency
    breadcrumbs: (event.breadcrumbs || []).slice(-maxBreadcrumbs),
    breadcrumbs_total: event.breadcrumbs?.length || 0,

    metaData: event.metaData || {},

    // Exception summary (stacktraces limited separately)
    exceptions: (event.exceptions || []).map((exc: BugsnagException, index: number) => ({
      index: index,
      errorClass: exc.errorClass,
      message: exc.message,
      type: exc.type,
      stacktraceFrameCount: exc.stacktrace?.length || 0,
    })),

    threads: event.threads || [],
  };

  // Format the stacktrace if available (limited frames)
  if (event.exceptions && event.exceptions.length > 0) {
    const primaryException: BugsnagException = event.exceptions[0];
    const { limited, total, truncated } = limitFrames(primaryException.stacktrace || [], maxFrames);

    const stacktraceText = formatStacktrace(limited, includeCode);

    let output = `# Stacktrace for ${primaryException.errorClass}: ${primaryException.message}\n\n`;

    if (truncated) {
      output += `⚠️  Showing ${maxFrames} of ${total} frames (use max_frames parameter to adjust)\n\n`;
    }

    output += stacktraceText;

    // Add formatted stacktrace as a separate field
    formattedEvent.formatted_stacktrace = output;
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
