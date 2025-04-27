// src/services/RequestLogger.js
//Logan

/**
 * Simple request logging service for the Recipe AI application
 * This is a demonstration tool for security presentation purposes
 */

class RequestLogger {
    constructor() {
      // Initialize logs array or get from localStorage
      this.logs = this.getStoredLogs();
      this.maxLogs = 100; // Maximum number of logs to store
    }
  
    // Log a new request
    logRequest(data) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
        ...data,
        status: data.status || 'pending'
      };
  
      // Add to beginning of array (newest first)
      this.logs.unshift(logEntry);
      
      // Trim logs if they exceed max count
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(0, this.maxLogs);
      }
      
      // Save to localStorage
      this.saveLogs();
      
      console.log(`[Security Log] ${logEntry.action}: ${logEntry.url || logEntry.details}`);
      
      return logEntry.requestId;
    }
    
    // Update an existing log (e.g., when request completes)
    updateLog(requestId, updates) {
      const index = this.logs.findIndex(log => log.requestId === requestId);
      
      if (index !== -1) {
        this.logs[index] = {
          ...this.logs[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        this.saveLogs();
        
        console.log(`[Security Log] Updated: ${this.logs[index].action} - ${updates.status || 'updated'}`);
      }
    }
    
    // Get all logs
    getLogs() {
      return [...this.logs];
    }
    
    // Clear all logs
    clearLogs() {
      this.logs = [];
      localStorage.removeItem('security_logs');
    }
    
    // Filter logs by type
    filterLogsByType(type) {
      return this.logs.filter(log => log.type === type);
    }
    
    // Helper: Generate a simple ID
    generateId() {
      return Math.random().toString(36).substr(2, 9);
    }
    
    // Helper: Get logs from localStorage
    getStoredLogs() {
      try {
        const storedLogs = localStorage.getItem('security_logs');
        return storedLogs ? JSON.parse(storedLogs) : [];
      } catch (error) {
        console.error('Error loading logs from storage:', error);
        return [];
      }
    }
    
    // Helper: Save logs to localStorage
    saveLogs() {
      try {
        localStorage.setItem('security_logs', JSON.stringify(this.logs));
      } catch (error) {
        console.error('Error saving logs to storage:', error);
      }
    }
    
    // Export logs as JSON
    exportLogs() {
      return JSON.stringify(this.logs, null, 2);
    }
  }
  
  // Create a singleton instance
  const loggerInstance = new RequestLogger();
  
  export default loggerInstance;