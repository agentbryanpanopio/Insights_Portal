import api from './api';

export const chatService = {
  async createSession(reportName, connectionName) {
    const response = await api.post('/chat/session', {
      reportName,
      connectionName,
    });
    return response.data;
  },

  async sendMessage(sessionId, message, connectionName) {
    const response = await api.post('/chat/message', {
      sessionId,
      message,
      connectionName,
    });
    return response.data;
  },

  async getChatHistory(sessionId) {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  },

  async getReportSummary(connectionName) {
    const response = await api.post('/chat/summary', {
      connectionName,
    });
    return response.data;
  },

  async queryData(connectionName, question) {
    const response = await api.post('/chat/query', {
      connectionName,
      question,
    });
    return response.data;
  },
};
