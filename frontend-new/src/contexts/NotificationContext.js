import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context
const NotificationContext = createContext();

// Generate unique IDs for notifications
let notificationId = 0;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

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

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: options.title || 'Success',
      message,
      ...options
    });
  }, [addNotification]);

  // Other notification types...

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className="notification success"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#d4edda',
            borderColor: '#c3e6cb',
            color: '#155724',
            padding: '10px 15px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <div className="notification-content">
            {notification.title && <div className="notification-title"><strong>{notification.title}</strong></div>}
            <div className="notification-message">{notification.message}</div>
          </div>
        </div>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};