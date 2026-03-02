import Anthropic from '@anthropic-ai/sdk';
import logger from '../config/logger.js';
import { ExternalServiceError } from '../middleware/errorHandler.js';

let anthropic;

export function initializeAnthropic() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('Anthropic API key not found');
    }

    anthropic = new Anthropic({
      apiKey: apiKey,
    });

    logger.info('Anthropic Claude AI initialized');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Anthropic:', error);
    throw new ExternalServiceError('Anthropic', error.message);
  }
}

export async function generateResponse(messages, systemPrompt, options = {}) {
  try {
    if (!anthropic) {
      initializeAnthropic();
    }

    const model = options.model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    const maxTokens = options.maxTokens || parseInt(process.env.ANTHROPIC_MAX_TOKENS) || 4096;

    logger.info(`Generating Claude response with model: ${model}`);

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages,
      temperature: options.temperature || 0.7,
    });

    logger.info('Claude response generated successfully');
    
    return {
      content: response.content[0].text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      model: response.model,
    };
  } catch (error) {
    logger.error('Failed to generate Claude response:', error);
    throw new ExternalServiceError('Anthropic', 'Failed to generate AI response');
  }
}

export function buildSystemPrompt(reportMetadata) {
  return `You are Aiko, an AI assistant specialized in Power BI analytics and data insights.

CONTEXT:
You are helping users understand and analyze their Power BI reports. You have access to:
- Report metadata including table names, columns, and relationships
- DAX measure definitions and formulas
- The actual data in the report via query capabilities

REPORT INFORMATION:
${reportMetadata ? JSON.stringify(reportMetadata, null, 2) : 'No report loaded yet'}

CAPABILITIES:
1. Explain DAX measures and formulas in plain language
2. Query data from the report to answer specific questions
3. Identify trends and patterns in visualizations
4. Provide insights based on the data
5. Help users understand the report structure

GUIDELINES:
- Be conversational and friendly
- Explain technical concepts in simple terms
- When asked about specific numbers, query the data to provide accurate answers
- If you need to see the actual data to answer, say so and execute a query
- Cite which measures or tables you're using in your analysis
- If uncertain, acknowledge it and explain what additional information would help

PERSONALITY:
- Professional but approachable
- Patient and educational
- Data-driven and precise
- Proactive in offering insights

Remember: You're here to make Power BI reports more accessible and actionable for users who may not be data experts.`;
}

export function buildChatMessages(conversationHistory, userMessage) {
  const messages = [];

  // Add conversation history
  for (const msg of conversationHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  return messages;
}

export function formatReportContext(metadata, selectedReport) {
  if (!selectedReport || !metadata) {
    return null;
  }

  return {
    reportName: selectedReport.name,
    lastRefresh: selectedReport.modifiedTime,
    tables: metadata.tables?.map(t => ({
      name: t.name,
      description: t.description,
    })) || [],
    measures: metadata.measures?.map(m => ({
      name: m.name,
      expression: m.expression,
      description: m.description,
    })) || [],
    totalMeasures: metadata.measures?.length || 0,
    totalTables: metadata.tables?.length || 0,
  };
}

export async function generateReportSummary(reportMetadata) {
  try {
    const prompt = `Based on this Power BI report metadata, provide a brief 2-3 sentence summary of what this report is about and what insights it can provide:

${JSON.stringify(reportMetadata, null, 2)}

Keep it concise and user-friendly.`;

    const response = await generateResponse(
      [{ role: 'user', content: prompt }],
      'You are a helpful assistant that summarizes Power BI reports.',
      { maxTokens: 300 }
    );

    return response.content;
  } catch (error) {
    logger.error('Failed to generate report summary:', error);
    return 'This report contains various data tables and measures for analysis.';
  }
}

export { anthropic };
