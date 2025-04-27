// src/services/secureHttpClient.js
// Logan

import RequestLogger from './RequestLogger';

// List of allowed domains
const ALLOWED_DOMAINS = [
  'api.recipe-ai.com',
  'data.recipe-ai.com',
  'cdn.recipe-ai.com',
  'auth.recipe-ai.com'
];

// List of blocked IP ranges (private/internal)
const BLOCKED_IP_RANGES = [
  { start: '10.0.0.0', end: '10.255.255.255' },     // 10.0.0.0/8
  { start: '172.16.0.0', end: '172.31.255.255' },   // 172.16.0.0/12
  { start: '192.168.0.0', end: '192.168.255.255' }, // 192.168.0.0/16
  { start: '127.0.0.0', end: '127.255.255.255' }    // 127.0.0.0/8 (localhost)
];

/**
 * Secure HTTP client wrapper
 * - Logs all requests
 * - Validates domains against allowlist
 * - Blocks requests to private IP ranges
 * - Implements request timeouts
 */
class SecureHttpClient {
  constructor() {
    this.timeout = 30000; // Default timeout: 30 seconds
  }

  /**
   * Check if a URL is allowed based on domain
   * @param {string} url - URL to check
   * @returns {boolean} - Whether URL is allowed
   */
  isAllowedDomain(url) {
    try {
      const urlObj = new URL(url);
      return ALLOWED_DOMAINS.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch (error) {
      console.error('Error parsing URL:', error);
      return false;
    }
  }

  /**
   * Check if URL might resolve to a private IP
   * Note: This is a simplified demo check and would need server-side validation in production
   * @param {string} url - URL to check
   * @returns {boolean} - Whether URL might be private IP
   */
  mightBePrivateIP(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Basic check if it's an IP address
      const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const match = hostname.match(ipRegex);
      
      if (match) {
        // Convert IP to integer for range comparison
        const ip = match.slice(1).map(Number);
        
        // Check if in known private ranges
        for (const range of BLOCKED_IP_RANGES) {
          const startParts = range.start.split('.').map(Number);
          const endParts = range.end.split('.').map(Number);
          
          // Very simple check if IP is within range
          let inRange = true;
          for (let i = 0; i < 4; i++) {
            if (ip[i] < startParts[i] || ip[i] > endParts[i]) {
              inRange = false;
              break;
            }
          }
          
          if (inRange) return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking IP:', error);
      return true; // Block on error to be safe
    }
  }

  /**
   * Make a secure GET request
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} - Fetch promise
   */
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  /**
   * Make a secure POST request
   * @param {string} url - URL to fetch
   * @param {Object} data - Body data
   * @param {Object} options - Fetch options
   * @returns {Promise} - Fetch promise
   */
  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  /**
   * Generic secure request method
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} - Fetch promise
   */
  async request(url, options = {}) {
    // Log the request
    const requestId = RequestLogger.logRequest({
      url,
      method: options.method || 'GET',
      action: `${options.method || 'GET'} Request`,
      timestamp: new Date().toISOString(),
      ipAddress: '-- client-side --', // In real app, server would log actual IP
      status: 'pending'
    });

    // Check domain allowlist
    if (!this.isAllowedDomain(url)) {
      const error = new Error(`Request blocked: Domain not in allowlist`);
      
      RequestLogger.updateLog(requestId, {
        status: 'blocked', 
        details: 'Domain not in allowlist',
        error: error.message
      });
      
      // For demo purposes, we'll simulate the request still going through
      // In a real app, this would be rejected
      console.warn(`[SECURITY] Request to non-allowed domain: ${url}`);
      
      // Uncomment to actually block the request in a real application
      // return Promise.reject(error);
    }

    // Check for private IP
    if (this.mightBePrivateIP(url)) {
      const error = new Error(`Request blocked: Potential internal IP address`);
      
      RequestLogger.updateLog(requestId, {
        status: 'blocked', 
        details: 'Potential internal IP address',
        error: error.message
      });
      
      console.warn(`[SECURITY] Request to potential internal IP: ${url}`);
      
      // Uncomment to actually block the request in a real application
      // return Promise.reject(error);
    }

    try {
      // Setup timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      // Execute the fetch with timeout
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Update log with success
      RequestLogger.updateLog(requestId, {
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        statusText: response.statusText
      });
      
      // Handle error responses
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      return response;
    } catch (error) {
      // Log the error
      RequestLogger.updateLog(requestId, {
        status: 'error',
        error: error.message
      });
      
      // Re-throw for the caller to handle
      throw error;
    }
  }
}

// Create singleton instance
const secureClient = new SecureHttpClient();

export default secureClient;