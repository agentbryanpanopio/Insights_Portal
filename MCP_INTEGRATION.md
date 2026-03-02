# Power BI MCP Server Integration Guide

## Overview

The webapp uses the Power BI Modeling MCP Server to interact with PBIX files. The MCP tools are available and loaded - they just need to be called from the backend.

## Available MCP Tools

The following Power BI MCP tools are now loaded and ready to use:

### Connection Management
- `powerbi-modeling-mcp:connection_operations` - Connect to PBIX files

### Data Querying  
- `powerbi-modeling-mcp:dax_query_operations` - Execute DAX queries

### Metadata Operations
- `powerbi-modeling-mcp:table_operations` - List/get tables
- `powerbi-modeling-mcp:measure_operations` - List/get measures
- `powerbi-modeling-mcp:column_operations` - List/get columns
- `powerbi-modeling-mcp:relationship_operations` - Get relationships

### Model Operations
- `powerbi-modeling-mcp:model_operations` - Get model metadata
- `powerbi-modeling-mcp:database_operations` - Database-level operations

## How to Use MCP Tools from Backend

### Step 1: Import the Tool Caller

In your backend service file, you'll call MCP tools through Claude's function calling system. Since this is already set up in the MCP architecture, you can call tools directly.

### Step 2: Example - Connect to PBIX

```javascript
// In mcpServer.js
export async function connectToPBIX(pbixPath, connectionName) {
  // Call the MCP connection tool
  const result = await callMCPTool('powerbi-modeling-mcp:connection_operations', {
    request: {
      operation: 'Connect',
      connectionString: `Data Source=${pbixPath}`,
      connectionName: connectionName
    }
  });
  
  return result;
}
```

### Step 3: Example - List Tables

```javascript
export async function listTables(connectionName) {
  const result = await callMCPTool('powerbi-modeling-mcp:table_operations', {
    request: {
      operation: 'List',
      connectionName: connectionName
    }
  });
  
  return result.tables || [];
}
```

### Step 4: Example - Execute DAX Query

```javascript
export async function executeDAXQuery(connectionName, daxQuery) {
  const result = await callMCPTool('powerbi-modeling-mcp:dax_query_operations', {
    request: {
      operation: 'Execute',
      connectionName: connectionName,
      query: daxQuery,
      maxRows: 1000
    }
  });
  
  return result;
}
```

## Integration Points in Current Code

### File: `backend/services/mcpServer.js`

Update these functions to use actual MCP tools:

1. **connectToPBIX** - Use `connection_operations` with operation: 'Connect'
2. **getMetadata** - Use `model_operations` with operation: 'Get'
3. **listTables** - Use `table_operations` with operation: 'List'  
4. **listMeasures** - Use `measure_operations` with operation: 'List'
5. **executeDAXQuery** - Use `dax_query_operations` with operation: 'Execute'
6. **getMeasureDefinition** - Use `measure_operations` with operation: 'Get'

## Implementation Steps

### For Immediate Testing (Without MCP)

The current code works as-is for testing the UI. It returns placeholder data.

### For Full MCP Integration

1. **Set up MCP Tool Caller**
   Create a utility function in `backend/utils/mcpCaller.js`:

```javascript
export async function callMCPTool(toolName, parameters) {
  // This would integrate with your MCP client
  // For now, log the call
  console.log(`Calling MCP tool: ${toolName}`, parameters);
  
  // In production, this calls the actual MCP server
  // return await mcpClient.call(toolName, parameters);
  
  // For now, return mock data
  return { success: true, data: [] };
}
```

2. **Update mcpServer.js**
   Replace placeholder code with actual MCP tool calls using the patterns above.

3. **Test with Real PBIX**
   Once integrated, the app will:
   - Connect to actual PBIX files
   - Read real table/measure metadata
   - Execute real DAX queries
   - Return actual data

## Common MCP Operations

### Get All Tables
```javascript
{
  request: {
    operation: 'List',
    connectionName: 'myConnection'
  }
}
```

### Get Specific Measure
```javascript
{
  request: {
    operation: 'Get',
    measureName: 'Total Sales',
    tableName: 'Sales',
    connectionName: 'myConnection'
  }
}
```

### Execute DAX
```javascript
{
  request: {
    operation: 'Execute',
    query: 'EVALUATE SUMMARIZE(Sales, Sales[Year], "Total", SUM(Sales[Amount]))',
    connectionName: 'myConnection',
    maxRows: 100
  }
}
```

## Error Handling

Always wrap MCP calls in try-catch:

```javascript
try {
  const result = await callMCPTool('...', { ... });
  return result;
} catch (error) {
  logger.error('MCP tool call failed:', error);
  throw new ExternalServiceError('MCP Server', error.message);
}
```

## Next Steps

1. ✅ Tools are loaded and available
2. ⏳ Implement MCP tool caller utility
3. ⏳ Update mcpServer.js functions
4. ⏳ Test with real PBIX file
5. ⏳ Verify DAX query execution

## Notes

- The MCP tools are already loaded in the current session
- All tool schemas are available (shown above)
- The frontend is ready to receive real data
- Just need to wire up the backend MCP calls

This integration is straightforward - the tools are ready, just need to call them!
