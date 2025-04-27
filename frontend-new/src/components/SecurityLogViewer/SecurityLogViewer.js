// src/components/SecurityLogViewer/SecurityLogViewer.js
// Logan

import React, { useState, useEffect } from 'react';
import RequestLogger from '../../services/RequestLogger';
import './SecurityLogViewer.css';

const SecurityLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Load logs when component mounts or when visibility changes
  useEffect(() => {
    if (isExpanded) {
      refreshLogs();
    }
  }, [isExpanded]);
  
  const refreshLogs = () => {
    const allLogs = RequestLogger.getLogs();
    setLogs(allLogs);
  };
  
  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all security logs?')) {
      RequestLogger.clearLogs();
      setLogs([]);
    }
  };
  
  const handleExportLogs = () => {
    const jsonString = RequestLogger.exportLogs();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipe-ai-security-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.status === filter);
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'blocked': return 'blocked';
      case 'warning': return 'warning';
      default: return 'pending';
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return (
    <div className={`security-log-viewer ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="security-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="security-title">
          <h3>Security Logs</h3>
          <div className="log-count">{logs.length}</div>
        </div>
        <button className="toggle-logs-btn">
          {isExpanded ? 'Hide Logs' : 'Show Logs'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="security-panel">
          <div className="log-controls">
            <div className="filter-controls">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'success' ? 'active' : ''}`}
                onClick={() => setFilter('success')}
              >
                Success
              </button>
              <button 
                className={`filter-btn ${filter === 'error' ? 'active' : ''}`}
                onClick={() => setFilter('error')}
              >
                Errors
              </button>
              <button 
                className={`filter-btn ${filter === 'blocked' ? 'active' : ''}`}
                onClick={() => setFilter('blocked')}
              >
                Blocked
              </button>
            </div>
            
            <div className="action-controls">
              <button 
                className="refresh-btn"
                onClick={refreshLogs}
                title="Refresh logs"
              >
                🔄
              </button>
              <button 
                className="export-btn"
                onClick={handleExportLogs}
                title="Export logs"
              >
                💾
              </button>
              <button 
                className="clear-btn"
                onClick={handleClearLogs}
                title="Clear logs"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div className="logs-container">
            {filteredLogs.length > 0 ? (
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>URL/Endpoint</th>
                    <th>IP Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.requestId} className={`log-row ${log.status}`}>
                      <td className="log-time" title={formatDate(log.timestamp)}>
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="log-action">{log.action}</td>
                      <td className="log-url" title={log.url}>
                        {log.url || log.details || '-'}
                      </td>
                      <td className="log-ip">{log.ipAddress || '-'}</td>
                      <td className="log-status">
                        <span className={`status-badge ${getStatusBadgeClass(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-logs">
                <div className="empty-icon">🔍</div>
                <p>No security logs found. API requests will appear here when made.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityLogViewer;