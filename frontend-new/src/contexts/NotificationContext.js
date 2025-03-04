
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context
const NotificationContext = createContext();

// Generate unique IDs for notifications
let notificationId = 0;

/**
 * NotificationProvider - Provider component for notification context
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const id = ++notificationId;
    
    setNotifications(prev => [
      ...prev,
      { 
        id,
        ...notification,
        duration: notification.duration !== undefined ? notification.duration : 3000
      }
    ]);
    
    return id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Show a success notification (shorthand)
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: options.title || 'Success',
      message,
      ...options
    });
  }, [addNotification]);

  // Show an error notification (shorthand)
  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      title: options.title || 'Error',
      message,
      ...options
    });
  }, [addNotification]);

  // Value to be provided by the context
  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Render all active notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`notification ${notification.type}`}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
              color: notification.type === 'success' ? '#155724' : '#721c24',
              padding: '12px 16px',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              marginBottom: '10px',
              maxWidth: '300px',
              zIndex: 1000
            }}
          >
            {notification.title && (
              <div className="notification-title" style={{ fontWeight: 'bold' }}>
                {notification.title}
              </div>
            )}
            <div className="notification-message">
              {notification.message}
            </div>
            
            {/* Auto-remove notification after duration */}
            {setTimeout(() => removeNotification(notification.id), notification.duration)}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

/**
 * useNotification - Custom hook to use notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;