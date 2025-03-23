import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Notification, { NotificationType } from './Notification';
import styles from './Notification.module.css';

interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  persistent?: boolean;
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType, persistent?: boolean) => {
    const id = uuidv4();
    setNotifications(prev => [...prev, { id, message, type, persistent }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Expose the addNotification function globally
  React.useEffect(() => {
    (window as any).showNotification = addNotification;
    return () => {
      delete (window as any).showNotification;
    };
  }, [addNotification]);

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          id={String(index * 60)} // 60px spacing between notifications
          message={notification.message}
          type={notification.type}
          persistent={notification.persistent}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager; 