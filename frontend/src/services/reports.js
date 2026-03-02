import api from './api';

export const reportsService = {
  async listReports() {
    const response = await api.get('/reports');
    return response.data;
  },

  async getReportDetails(fileId) {
    const response = await api.get(`/reports/${fileId}`);
    return response.data;
  },

  async getReportMetadata(connectionName) {
    const response = await api.get(`/reports/${connectionName}/metadata`);
    return response.data;
  },

  async getReportTables(connectionName) {
    const response = await api.get(`/reports/${connectionName}/tables`);
    return response.data;
  },

  async getReportMeasures(connectionName, tableName = null) {
    const params = tableName ? { tableName } : {};
    const response = await api.get(`/reports/${connectionName}/measures`, { params });
    return response.data;
  },
};
