/**
 * Bugsnag API client
 */

import axios, { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

// API key from environment variables
const API_KEY = process.env.BUGSNAG_API_KEY;

/**
 * Initialize the Bugsnag API client
 * This is done lazily when needed to allow for API key validation
 */
export function initApiClient(): AxiosInstance {
  if (!API_KEY) {
    throw new McpError(
      ErrorCode.InternalError,
      "BUGSNAG_API_KEY environment variable is required"
    );
  }

  return axios.create({
    baseURL: "https://api.bugsnag.com",
    headers: {
      Authorization: `token ${API_KEY}`,
      "X-Version": "2",
      "Content-Type": "application/json",
    },
  });
}