# Bugsnag MCP Server

A Model Context Protocol (MCP) server for interacting with Bugsnag. This server allows LLM tools like Cursor and Claude to investigate and resolve issues in Bugsnag.

## ✨ Features

### Error Monitoring & Analysis
- **Organization & Project Navigation**: Easily browse your Bugsnag hierarchy
- **Error & Event Filtering**: Find specific issues with powerful filtering options
- **Detailed Stacktrace Viewing**: See formatted stacktraces with source code context and highlighted error lines
- **Exception Chain Visualization**: Understand the root cause by viewing the full exception chain

### Code Intelligence
- **Project vs. Library Code Distinction**: Clearly identify your code vs third-party libraries
- **Source Code Context**: View relevant code snippets around error locations
- **Error Patterns**: Identify recurring patterns across multiple errors

### Issue Management
- **Search Capabilities**: Find issues by error class, message, or app version
- **Error Details**: Get comprehensive information about each error
- **Event History**: View all occurrences of a specific error

## 🚀 Quick Setup

Setting up the Bugsnag MCP server is simple and doesn't require any installation or downloading source code.

### For Cursor

1. Add the Bugsnag MCP server configuration:
   ```json
   {
     "mcpServers": {
       "bugsnag": {
         "command": "npx",
         "args": ["-y", "bugsnag-mcp-server"],
         "env": {
           "BUGSNAG_API_KEY": "your-bugsnag-api-key"
         },
         "disabled": false,
         "alwaysAllow": []
       }
     }
   }
   ```

2. Replace `your-bugsnag-api-key` with your Bugsnag API key

### For Claude Desktop

1. Add the Bugsnag MCP server configuration:
   ```json
   {
     "mcpServers": {
       "bugsnag": {
         "command": "npx",
         "args": ["-y", "bugsnag-mcp-server"],
         "env": {
           "BUGSNAG_API_KEY": "your-bugsnag-api-key"
         },
         "disabled": false,
         "alwaysAllow": []
       }
     }
   }
   ```

2. Replace `your-bugsnag-api-key` with your Bugsnag API key

## 🔑 Obtaining a Bugsnag API Key

To use this MCP server, you'll need a Bugsnag API key:

1. Log in to your Bugsnag account at [https://app.bugsnag.com/](https://app.bugsnag.com/)
2. Go to **Settings** > **Organization settings** > **Access tokens**
3. Create a new personal access token with the following permissions:
   - Read projects
   - Read and write errors
   - Read and write comments
4. Copy the generated token for use with the MCP server

## 📋 Usage Examples

Once configured, you can use the Bugsnag MCP server with your LLM tool. Here are some example prompts:

### Exploring Your Bugsnag Account

```
List all my Bugsnag organizations
```

```
Show me all projects in organization "org_12345"
```

### Finding and Analyzing Errors

```
List the open errors in my Bugsnag project "project_12345"
```

```
Show me the details for Bugsnag error ID "error_12345"
```

```
Show me the detailed stacktrace for event "event_12345" in project "project_12345"
```

```
View the exception chain for event "event_12345" in project "project_12345"
```

### Searching for Specific Issues

```
Search for Bugsnag issues in project "project_12345" related to "NullPointerException"
```

```
List all events for error "error_12345" in project "project_12345"
```

## 📚 Available Tools

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

#### search_issues

Searches for issues using various criteria.

Parameters:
- `project_id` (required): Bugsnag project ID
- `query`: Search query
- `error_class`: Filter by error class
- `app_version`: Filter by app version

## 🛠️ Advanced Usage

### Testing Your API Key

You can test if your Bugsnag API key is valid using:

```bash
npx bugsnag-mcp-server test-api-key your-bugsnag-api-key
```

If your API key is valid, this will display a list of your Bugsnag projects with their IDs.

### Installation Options

While using `npx` is recommended for most users, you can also install the package globally if you prefer:

```bash
npm install -g bugsnag-mcp-server
```

### For Developers

If you're interested in contributing or modifying the code:

1. Clone the repository:
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

4. Run tests:
   ```bash
   npm test
   ```

5. Run tests with coverage:
   ```bash
   npm run test:coverage
   ```

6. Format code:
  ```bash
  npm run format
  ```

7. Check code formatting:
  ```bash
  npm run format:check
  ```

### Continuous Integration

This project uses GitHub Actions for continuous integration. The workflows automatically:

- Runs on push to the main branch and on pull requests
- Tests against multiple Node.js versions (18.x and 20.x)
- Runs the test suite
- Generates and uploads test coverage reports
- Checks code formatting with Prettier

You can view the workflow configurations in:
- `.github/workflows/test.yml` - For running tests
- `.github/workflows/prettier.yml` - For checking code formatting

## License

MIT
