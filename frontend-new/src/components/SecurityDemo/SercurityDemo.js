// src/components/SecurityDemo/SecurityDemo.js

//Logan

import React, { useState } from 'react';
import secureHttpClient from '../../services/secureHttpClient';
import SecurityLogViewer from '../SecurityLogViewer/SecurityLogViewer';
import './SecurityDemo.css';

const SecurityDemo = () => {
  const [url, setUrl] = useState('https://api.recipe-ai.com/recipes');
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestResult, setRequestResult] = useState(null);
  
  const testEndpoints = [
    { url: 'https://api.recipe-ai.com/recipes', name: 'Allowed API Endpoint' },
    { url: 'https://not-allowed-domain.com/data', name: 'Non-allowed Domain' },
    { url: 'https://192.168.1.1/admin', name: 'Internal IP (Blocked)' },
    { url: 'https://cdn.recipe-ai.com/images', name: 'Allowed CDN Endpoint' }
  ];
  
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
  
  const simulateRequest = async () => {
    try {
      setRequestStatus('loading');
      setRequestResult(null);
      
      // This is a simulated request for demo purposes
      // In a real app, this would actually make the request
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if URL is from non-allowed domain
      if (!url.includes('recipe-ai.com')) {
        // For demo, we'll show the request was made but blocked
        setRequestStatus('blocked');
        setRequestResult({
          success: false,
          message: 'Request blocked: Domain not in allowlist'
        });
        return;
      }
      
      // Check if URL might be an internal IP
      if (url.match(/^https?:\/\/(\d{1,3}\.){3}\d{1,3}/)) {
        setRequestStatus('blocked');
        setRequestResult({
          success: false,
          message: 'Request blocked: Potential internal IP address'
        });
        return;
      }
      
      // Simulate a successful request
      setRequestStatus('success');
      setRequestResult({
        success: true,
        message: 'Request completed successfully',
        data: {
          endpoint: url,
          accessGranted: true,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      setRequestStatus('error');
      setRequestResult({
        success: false,
        message: error.message
      });
    }
  };
  
  return (
    <div className="security-demo">
      <div className="demo-header">
        <h2>Security Logging Demo</h2>
        <p>Test the request logging and domain restrictions</p>
      </div>
      
      <div className="request-simulator">
        <div className="input-group">
          <label htmlFor="endpoint-url">API Endpoint</label>
          <input 
            type="text" 
            id="endpoint-url"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter URL to test..."
          />
        </div>
        
        <div className="test-endpoints">
          <label>Quick Test Endpoints:</label>
          <div className="endpoint-buttons">
            {testEndpoints.map((endpoint, index) => (
              <button
                key={index}
                onClick={() => setUrl(endpoint.url)}
                className="endpoint-btn"
              >
                {endpoint.name}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className={`simulate-btn ${requestStatus === 'loading' ? 'loading' : ''}`}
          onClick={simulateRequest}
          disabled={requestStatus === 'loading'}
        >
          {requestStatus === 'loading' ? 'Sending...' : 'Test Request'}
        </button>
        
        {requestResult && (
          <div className={`request-result ${requestStatus}`}>
            <div className="result-header">
              <span className="result-status">{requestStatus.toUpperCase()}</span>
              <span className="result-message">{requestResult.message}</span>
            </div>
            
            {requestResult.data && (
              <pre className="result-data">
                {JSON.stringify(requestResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
      
      {/* Security Log Viewer Component */}
      <SecurityLogViewer />
      
      <div className="implementation-notes">
        <h3>Implementation Details</h3>
        <ul>
          <li>
            <strong>Request Logging:</strong> All API requests are captured and logged with timestamps, status, and other metadata.
          </li>
          <li>
            <strong>Domain Restriction:</strong> Requests are checked against an allowed domains list.
          </li>
          <li>
            <strong>IP Range Blocking:</strong> Requests to private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, etc.) are identified and blocked.
          </li>
          <li>
            <strong>Safe HTTP Client:</strong> Implements timeout control and proper error handling for all requests.
          </li>
        </ul>
        <div className="security-note">
          <div className="note-icon">🔒</div>
          <div className="note-content">
            <p><strong>Note:</strong> This is a simplified demonstration for educational purposes. In a production environment, domain and IP restrictions should be enforced server-side.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDemo;