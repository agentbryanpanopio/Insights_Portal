import { FiBarChart2 } from 'react-icons/fi';

function Pane2Viewer({ selectedReport, user }) {
  const firstName = user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || user?.email?.split('@')[0];

  return (
    <div className="pane border-r-0 custom-scrollbar">
      {selectedReport ? (
        <>
          {/* Report Header */}
          <div className="pane-header">
            <h2 className="pane-title">{selectedReport.name}</h2>
            <p className="pane-subtitle">
              Last refreshed: {new Date(selectedReport.modifiedTime).toLocaleString()}
            </p>
          </div>

          {/* Report Viewer - Power BI Embed would go here */}
          <div className="flex-1 p-4">
            <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500 max-w-md px-6">
                <FiBarChart2 className="mx-auto text-6xl mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Report Viewer</h3>
                <p className="text-sm">
                  Power BI report embedding will be displayed here once Power BI Service integration is configured.
                </p>
                <p className="text-xs mt-4 text-gray-400">
                  For now, you can chat with Aiko about the report metadata and data in the right pane.
                </p>
                
                {/* Placeholder for iframe */}
                {/* 
                <iframe
                  title="Power BI Report"
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                */}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Welcome Message */
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-lg animate-fade-in">
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-primary-600 mb-2">Hello, {firstName}!</h1>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <span className="text-xl">I'm</span>
                <span className="text-3xl font-semibold text-primary-600">Aiko</span>
              </div>
            </div>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Your AI assistant for Power BI analytics
              </p>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-primary-700 mb-2">I can help you:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Understand your Power BI reports and measures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Answer questions about your data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Explain DAX formulas in plain language</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Identify trends and insights</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-600">
                  👈 Select a report from the list to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pane2Viewer;
