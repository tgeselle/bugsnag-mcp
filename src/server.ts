/**
 * Bugsnag MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

import { initApiClient } from './api/client.js';
import { toolDefinitions } from './tools/index.js';
import * as tools from './tools/index.js';
import { handleResourceRequest, listResources } from './resources/index.js';

/**
 * Main Bugsnag MCP Server class
 */
export class BugsnagServer {
  private server: Server;

  constructor() {
    // Initialize server
    this.server = new Server(
      {
        name: 'bugsnag-mcp-server',
        version: '1.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // Set up handlers
    this.setupToolHandlers();
    this.setupResourceHandlers();

    // Error handling
    this.server.onerror = error => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Set up tool handlers for Bugsnag operations
   */
  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: toolDefinitions,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      try {
        switch (request.params.name) {
          case 'list_organizations':
            return await tools.handleListOrganizations(request.params.arguments);
          case 'list_projects':
            return await tools.handleListProjects(request.params.arguments);
          case 'list_errors':
            return await tools.handleListErrors(request.params.arguments);
          case 'view_error':
            return await tools.handleViewError(request.params.arguments);
          case 'list_error_events':
            return await tools.handleListErrorEvents(request.params.arguments);
          case 'view_latest_event':
            return await tools.handleViewLatestEvent(request.params.arguments);
          case 'view_event':
            return await tools.handleViewEvent(request.params.arguments);
          case 'view_stacktrace':
            return await tools.handleViewStacktrace(request.params.arguments);
          case 'view_exception_chain':
            return await tools.handleViewExceptionChain(request.params.arguments);
          case 'view_tabs':
            return await tools.handleViewTabs(request.params.arguments);
          case 'search_issues':
            return await tools.handleSearchIssues(request.params.arguments);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: 'text',
                text: `Bugsnag API error: ${error.response?.data?.message || error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  /**
   * Set up resource handlers for Bugsnag resources
   */
  private setupResourceHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      try {
        const client = initApiClient();
        const resources = await listResources(client);
        return { resources };
      } catch (error) {
        console.error('Error listing resources:', error);
        return { resources: [] };
      }
    });

    // Read resource content
    this.server.setRequestHandler(ReadResourceRequestSchema, async request => {
      try {
        const uri = request.params.uri;
        const client = initApiClient();

        const content = await handleResourceRequest(uri, client);

        return {
          contents: [content],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `Bugsnag API error: ${error.response?.data?.message || error.message}`
          );
        }
        throw error;
      }
    });
  }

  /**
   * Start the server
   */
  async connect(transport: any) {
    await this.server.connect(transport);
    console.error('Bugsnag MCP server running');
  }

  /**
   * Close the server
   */
  async close() {
    await this.server.close();
  }
}
