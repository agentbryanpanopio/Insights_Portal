import { useState, useEffect, useRef } from 'react';
import { FiSend, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { chatService } from '../services/chat';
import ReactMarkdown from 'react-markdown';

function Pane3Chat({ selectedReport, connectionName, chatSession, reportMetadata }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [volumeOn, setVolumeOn] = useState(false);
  const [reportSummary, setReportSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load report summary when report is selected
  useEffect(() => {
    if (connectionName && chatSession) {
      loadReportSummary();
    }
  }, [connectionName, chatSession]);

  const loadReportSummary = async () => {
    try {
      setLoadingSummary(true);
      const data = await chatService.getReportSummary(connectionName);
      setReportSummary(data.summary);
    } catch (err) {
      console.error('Failed to load summary:', err);
      setReportSummary('This report contains various data for analysis.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !chatSession) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    // Add user message to UI immediately
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date() },
    ]);

    try {
      const response = await chatService.sendMessage(
        chatSession.sessionId,
        userMessage,
        connectionName
      );

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your message. Please try again.',
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="pane border-r-0 flex flex-col">
      {/* Header */}
      <div className="pane-header flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="pane-title">Aiko</h2>
            <button
              onClick={() => setVolumeOn(!volumeOn)}
              className="p-1 text-dark-600 hover:text-primary-600 transition-colors"
              title={volumeOn ? 'Volume On' : 'Volume Off'}
            >
              {volumeOn ? <FiVolume2 /> : <FiVolumeX />}
            </button>
          </div>
          {chatSession && (
            <p className="pane-subtitle">
              Chat history saved{' '}
              <a
                href={`/docs/chat_history/${chatSession.chatHistoryFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                here
              </a>
            </p>
          )}
        </div>
      </div>

      {selectedReport ? (
        <>
          {/* Report Summary */}
          {chatSession && (
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {selectedReport.name}
              </h3>
              {loadingSummary ? (
                <div className="flex items-center text-xs text-gray-500">
                  <span className="spinner mr-2"></span>
                  Analyzing report...
                </div>
              ) : (
                <p className="text-xs text-gray-600">{reportSummary}</p>
              )}
              <p className="text-xs text-gray-500 mt-2 italic">
                What do you want to know about this report?
              </p>
            </div>
          )}

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Start a conversation with Aiko</p>
                <p className="text-xs mt-2">
                  Try asking: "What measures are in this report?"
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`animate-slide-up ${
                    msg.role === 'user' ? 'message-user' : 'message-assistant'
                  } ${msg.error ? 'border-red-300 bg-red-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold text-sm">
                      {msg.role === 'user' ? 'You' : 'Aiko'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800 prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Aiko a question..."
                disabled={sending || !chatSession}
                className="flex-1 input-field disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !inputMessage.trim() || !chatSession}
                className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <span className="spinner"></span>
                    <span className="hidden sm:inline">Sending...</span>
                  </>
                ) : (
                  <>
                    <FiSend />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      ) : (
        /* No Report Selected */
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">Select a report to start chatting</p>
            <p className="text-xs mt-2">
              👈 Choose a report from the list on the left
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pane3Chat;
