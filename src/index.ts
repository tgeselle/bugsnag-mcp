#!/usr/bin/env node

/**
 * Bugsnag MCP Server
 *
 * This MCP server provides tools for interacting with the Bugsnag API,
 * allowing LLM tools like Cursor and Claude Desktop to investigate and resolve issues.
 *
 * Features:
 * - Organization & Project Management: List organizations and projects
 * - Error & Event Management: List errors and events with filtering options
 * - Detailed Stacktrace Viewing: Format stacktraces with source code context
 * - Exception Chain Visualization: View the full chain of exceptions
 * - Project vs. Library Code Distinction: Clearly distinguish between project code and third-party library code
 * - Issue Management: Resolve issues, add comments, assign to team members, and search for specific issues
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { BugsnagServer } from "./server.js";

// Create and run the server
const server = new BugsnagServer();
server.connect(new StdioServerTransport()).catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
