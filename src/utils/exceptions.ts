/**
 * Utility functions for formatting exception chains
 */

import { Exception } from "../types/index.js";

/**
 * Format the chain of exceptions
 */
export function formatExceptionChain(exceptions: Exception[]): string {
  if (!exceptions || exceptions.length === 0) {
    return "No exceptions available.";
  }
  
  let result = "";
  
  exceptions.forEach((exception, index) => {
    const indent = "  ".repeat(index);
    const prefix = index === 0 ? "# Primary Exception: " : `${indent}└─ Caused by: `;
    
    result += `${prefix}${exception.errorClass}: ${exception.message}\n`;
  });
  
  return result;
}