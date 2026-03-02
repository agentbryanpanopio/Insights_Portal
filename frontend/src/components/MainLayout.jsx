import { useState, useEffect } from 'react';
import Split from 'react-split';
import Pane1Reports from './Pane1Reports';
import Pane2Viewer from './Pane2Viewer';
import Pane3Chat from './Pane3Chat';
import { reportsService } from '../services/reports';
import { chatService } from '../services/chat';

function MainLayout({ user, onLogout }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [connectionName, setConnectionName] = useState(null);
  const [reportMetadata, setReportMetadata] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.listReports();
      setReports(data.reports);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = async (report) => {
    try {
      setSelectedReport(report);
      setError('');

      // Get report details and connect to PBIX
      const details = await reportsService.getReportDetails(report.id);
      setConnectionName(details.connectionName);

      // Get metadata
      const metadata = await reportsService.getReportMetadata(details.connectionName);
      setReportMetadata(metadata.metadata);

      // Create chat session
      const session = await chatService.createSession(report.name, details.connectionName);
      setChatSession(session);
    } catch (err) {
      setError('Failed to load report: ' + (err.response?.data?.error?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-red-700 text-sm">
          <span className="font-medium">Error:</span> {error}
          <button
            onClick={() => setError('')}
            className="ml-4 text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 3-Pane Layout */}
      <div className="flex-1 overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[20, 50, 30]}
          minSize={[200, 400, 300]}
          gutterSize={8}
          gutterStyle={() => ({
            backgroundColor: '#e5e7eb',
            cursor: 'col-resize',
          })}
        >
          {/* Pane 1: Reports List */}
          <Pane1Reports
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={handleSelectReport}
            loading={loading}
            user={user}
            onLogout={onLogout}
          />

          {/* Pane 2: Report Viewer */}
          <Pane2Viewer
            selectedReport={selectedReport}
            user={user}
          />

          {/* Pane 3: Chat with Aiko */}
          <Pane3Chat
            selectedReport={selectedReport}
            connectionName={connectionName}
            chatSession={chatSession}
            reportMetadata={reportMetadata}
          />
        </Split>
      </div>
    </div>
  );
}

export default MainLayout;
