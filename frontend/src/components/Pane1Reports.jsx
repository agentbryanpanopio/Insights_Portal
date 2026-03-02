import { useState } from 'react';
import { FiFolder, FiFile, FiLogOut, FiChevronDown, FiChevronRight } from 'react-icons/fi';

function Pane1Reports({ reports, selectedReport, onSelectReport, loading, user, onLogout }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="pane custom-scrollbar">
      {/* Header */}
      <div className="pane-header">
        <h2 className="pane-title">Reports</h2>
        <p className="pane-subtitle">Select a report to analyze</p>
      </div>

      {/* Reports Tree */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner"></div>
            <span className="ml-2 text-gray-600">Loading reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiFolder className="mx-auto text-4xl mb-2 text-gray-400" />
            <p>No reports found</p>
            <p className="text-sm mt-1">Upload PBIX files to your Google Drive</p>
          </div>
        ) : (
          <div className="space-y-1">
            {reports.map((category, idx) => {
              const isExpanded = expandedCategories.has(category.category);
              const hasFiles = category.files && category.files.length > 0;

              return (
                <div key={idx}>
                  {/* Category/Workspace */}
                  <div
                    onClick={() => hasFiles && toggleCategory(category.category)}
                    className={`tree-item flex items-center ${
                      hasFiles ? 'cursor-pointer' : 'cursor-default opacity-50'
                    }`}
                  >
                    <span className="mr-2 text-gray-600">
                      {hasFiles ? (
                        isExpanded ? <FiChevronDown /> : <FiChevronRight />
                      ) : (
                        <FiFolder />
                      )}
                    </span>
                    <span className="mr-2 text-primary-600">
                      {isExpanded ? <FiFolder /> : <FiFolder />}
                    </span>
                    <span className="font-medium text-gray-700">{category.category}</span>
                    {hasFiles && (
                      <span className="ml-auto text-xs text-gray-500">
                        ({category.files.length})
                      </span>
                    )}
                  </div>

                  {/* Files in category */}
                  {isExpanded && hasFiles && (
                    <div className="ml-8 mt-1 space-y-1">
                      {category.files.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => onSelectReport(file)}
                          className={`tree-item flex items-center ${
                            selectedReport?.id === file.id ? 'tree-item-selected' : ''
                          }`}
                        >
                          <FiFile className="mr-2 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Info & Logout at Bottom */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || user?.name || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="ml-2 p-2 text-dark-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pane1Reports;
