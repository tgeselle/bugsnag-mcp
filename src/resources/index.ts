/**
 * Resource handlers for Bugsnag resources
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { handleOrganizationResource } from "./organizations.js";
import { handleProjectResource } from "./projects.js";
import { handleErrorResource } from "./errors.js";
import { handleEventResource } from "./events.js";

/**
 * Handle a resource request
 * This function tries each resource handler until one returns a non-null result
 */
export async function handleResourceRequest(uri: string, client: AxiosInstance) {
  // Try each resource handler
  const handlers = [
    handleOrganizationResource,
    handleProjectResource,
    handleErrorResource,
    handleEventResource,
  ];
  
  for (const handler of handlers) {
    const result = await handler(uri, client);
    if (result) {
      return result;
    }
  }
  
  // If no handler matched, throw an error
  throw new McpError(
    ErrorCode.InvalidRequest,
    `Invalid URI format: ${uri}`
  );
}

/**
 * List available resources
 */
export async function listResources(client: AxiosInstance) {
  try {
    const response = await client.get("/user/organizations");
    
    // Create resources for organizations
    const resources = response.data.map((org: any) => ({
      uri: `bugsnag://organization/${org.id}`,
      mimeType: "application/json",
      name: org.name,
      description: `Bugsnag organization: ${org.name}`,
    }));
    
    return resources;
  } catch (error) {
    console.error("Error listing resources:", error);
    return [];
  }
}