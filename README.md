# Bugsnag MCP Server

A Model Context Protocol (MCP) server for interacting with Bugsnag. This server allows LLM tools like Cursor to investigate and resolve issues in Bugsnag.

## Features

- **Organization & Project Management**: List organizations and projects to easily navigate the Bugsnag hierarchy
- **Error & Event Management**: List errors and events with filtering options to find specific issues
- **Detailed Stacktrace Viewing**: Format stacktraces with source code context, line numbers, and visual highlighting of error lines
- **Exception Chain Visualization**: View the full chain of exceptions to understand the root cause of issues
- **Project vs. Library Code Distinction**: Clearly distinguish between project code and third-party library code
- **Issue Management**: Resolve issues, add comments, assign to team members, and search for specific issues

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A Bugsnag account with API access

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/bugsnag-mcp.git
   cd bugsnag-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Obtaining a Bugsnag API Key

To use this MCP server, you'll need a Bugsnag API key:

1. Log in to your Bugsnag account at [https://app.bugsnag.com/](https://app.bugsnag.com/)
2. Go to **Settings** > **Organization settings** > **Access tokens**
3. Create a new personal access token with the following permissions:
   - Read projects
   - Read and write errors
   - Read and write comments
4. Copy the generated token for use with the MCP server

## Testing Your API Key

Before configuring the MCP server, you can test if your Bugsnag API key is valid using the included test script:

```bash
node test-api-key.js YOUR_API_KEY
```

If your API key is valid, the script will display a list of your Bugsnag projects with their IDs, which you'll need when using the MCP tools.

## Configuration

### For Cursor

To use this MCP server with Cursor:

1. Edit the MCP settings file at:
   - macOS: `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`
   - Windows: `%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`
   - Linux: `~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`

2. Add the Bugsnag MCP server configuration:
   ```json
   {
     "mcpServers": {
       "bugsnag": {
         "command": "node",
         "args": ["/path/to/bugsnag-mcp/build/index.js"],
         "env": {
           "BUGSNAG_API_KEY": "your-bugsnag-api-key"
         },
         "disabled": false,
         "alwaysAllow": []
       }
     }
   }
   ```

3. Replace `/path/to/bugsnag-mcp` with the actual path to your installation
4. Replace `your-bugsnag-api-key` with your Bugsnag API key

### For Claude Desktop

To use this MCP server with Claude Desktop:

1. Edit the Claude Desktop config file at:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. Add the Bugsnag MCP server configuration:
   ```json
   {
     "mcpServers": {
       "bugsnag": {
         "command": "node",
         "args": ["/path/to/bugsnag-mcp/build/index.js"],
         "env": {
           "BUGSNAG_API_KEY": "your-bugsnag-api-key"
         },
         "disabled": false,
         "alwaysAllow": []
       }
     }
   }
   ```

## Usage Examples

Once the MCP server is configured, you can use it with Cursor or Claude Desktop. Here are some example prompts:

### Organization & Project Management

```
List all my Bugsnag organizations
```

```
Show me all projects in organization "org_12345"
```

### Error & Event Management

```
List the open errors in my Bugsnag project "project_12345"
```

```
Show me the details for Bugsnag error ID "error_12345"
```

```
List all events for error "error_12345" in project "project_12345"
```

```
Show me the latest event for error "error_12345"
```

### Stacktrace Analysis

```
Show me the detailed stacktrace for event "event_12345" in project "project_12345"
```

```
View the exception chain for event "event_12345" in project "project_12345"
```

### Issue Management

```
Resolve the Bugsnag issue with ID "error_12345" with the comment "Fixed in latest release"
```

```
Add a comment to Bugsnag issue "error_12345" saying "This is related to the database connection timeout"
```

```
Assign Bugsnag issue "error_12345" to user "user_67890"
```

```
Search for Bugsnag issues in project "project_12345" related to "NullPointerException"
```

## Available Tools

The Bugsnag MCP server provides the following tools:

### Organization & Project Management

#### list_organizations

Lists available Bugsnag organizations.

Parameters:
- None required

#### list_projects

Lists projects in an organization.

Parameters:
- `organization_id` (required): Bugsnag organization ID

### Error & Event Management

#### list_errors

Lists errors in a project with filtering options.

Parameters:
- `project_id` (required): Bugsnag project ID
- `status`: Filter by error status ("open", "fixed", "ignored")
- `sort`: Sort order for errors ("newest", "oldest", "priority")
- `limit`: Maximum number of errors to return

#### view_error

Gets detailed information about a specific error.

Parameters:
- `error_id` (required): Bugsnag error ID

#### list_error_events

Lists events (occurrences) for a specific error.

Parameters:
- `project_id` (required): Bugsnag project ID
- `error_id` (required): Bugsnag error ID
- `limit`: Maximum number of events to return

#### view_latest_event

Views the latest event for an error.

Parameters:
- `error_id` (required): Bugsnag error ID

#### view_event

Views detailed information about a specific event.

Parameters:
- `project_id` (required): Bugsnag project ID
- `event_id` (required): Bugsnag event ID

### Stacktrace Analysis

#### view_stacktrace

Extracts and formats stacktrace information from an event.

Parameters:
- `project_id` (required): Bugsnag project ID
- `event_id` (required): Bugsnag event ID
- `include_code`: Include source code context if available (default: true)

#### view_exception_chain

Views the full chain of exceptions for an event.

Parameters:
- `project_id` (required): Bugsnag project ID
- `event_id` (required): Bugsnag event ID

### Issue Management

#### resolve_issue

Marks an issue as resolved.

Parameters:
- `issue_id` (required): Bugsnag issue ID
- `resolution_comment`: Optional comment explaining the resolution

#### comment_on_issue

Adds a comment to an issue.

Parameters:
- `issue_id` (required): Bugsnag issue ID
- `comment_text` (required): Comment text

#### assign_issue

Assigns an issue to a team member.

Parameters:
- `issue_id` (required): Bugsnag issue ID
- `user_id` (required): Bugsnag user ID to assign the issue to

#### search_issues

Searches for issues using various criteria.

Parameters:
- `project_id` (required): Bugsnag project ID
- `query`: Search query
- `error_class`: Filter by error class
- `app_version`: Filter by app version

## Development

### Running in Development Mode

To run the server in development mode:

```bash
npm run watch
```

### Testing with the MCP Inspector

You can test the server using the MCP Inspector:

```bash
npm run inspector
```

## License

MIT
