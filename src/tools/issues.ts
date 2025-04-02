/**
 * Issue management tool handlers
 */

import { initApiClient } from "../api/client.js";
import { ToolHandler } from "../types/index.js";

/**
 * Handle the list_issues tool
 */
export const handleListIssues: ToolHandler = async (args) => {
  const projectId = args.project_id;
  const status = args.status || "open";
  const sort = args.sort || "newest";
  const limit = args.limit || 10;
  
  const client = initApiClient();
  const response = await client.get(`/projects/${projectId}/events`, {
    params: { status, sort, per_page: limit }
  });
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(response.data, null, 2)
    }]
  };
};

/**
 * Handle the view_issue tool
 */
export const handleViewIssue: ToolHandler = async (args) => {
  const issueId = args.issue_id;
  
  const client = initApiClient();
  const response = await client.get(`/events/${issueId}`);
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(response.data, null, 2)
    }]
  };
};
