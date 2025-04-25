// Notification Context for managing notifications and alerts
import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification provider component
export const NotificationProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // Add a notification
  const addNotification = useCallback((message, type = 'info', autoHide = true, duration = 5000) => {
    const id = uuidv4();
    
    // Add notification to the list
    setNotifications(prev => [
      ...prev,
      {
        id,
        message,
        type,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Auto-hide notification after duration
    if (autoHide) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  // Remove notification by id
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Shorthand functions for different notification types
  const showSuccess = useCallback((message, autoHide = true, duration = 5000) => {
    return addNotification(message, 'success', autoHide, duration);
  }, [addNotification]);
  
  const showError = useCallback((message, autoHide = true, duration = 5000) => {
    return addNotification(message, 'error', autoHide, duration);
  }, [addNotification]);
  
  const showWarning = useCallback((message, autoHide = true, duration = 5000) => {
    return addNotification(message, 'warning', autoHide, duration);
  }, [addNotification]);
  
  const showInfo = useCallback((message, autoHide = true, duration = 5000) => {
    return addNotification(message, 'info', autoHide, duration);
  }, [addNotification]);
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
      }}
    >
      {children}
      
      {/* Notification Display Component */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            <div className="notification-content">
              <span className="notification-message">{notification.message}</span>
            </div>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};