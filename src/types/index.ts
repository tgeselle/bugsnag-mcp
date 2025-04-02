/**
 * Common type definitions for the Bugsnag MCP server
 */

import { AxiosInstance } from "axios";

/**
 * Tool handler function type
 */
export type ToolHandler = (args: any) => Promise<any>;

/**
 * Resource handler function type
 */
export type ResourceHandler = (uri: string, client: AxiosInstance) => Promise<any>;

/**
 * Stacktrace frame type
 */
export interface StacktraceFrame {
  file?: string;
  lineNumber?: number;
  columnNumber?: number;
  method?: string;
  inProject?: boolean;
  code?: Record<string, string>;
}

/**
 * Exception type
 */
export interface Exception {
  errorClass: string;
  message: string;
  stacktrace?: StacktraceFrame[];
}