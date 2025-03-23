import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import styles from './Notification.module.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  persistent?: boolean;
  onClose: () => void;
  id: string;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  persistent = false,
  onClose,
  id
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const createdTime = useRef(Date.now());

  useEffect(() => {
    if (!persistent) {
      const timeElapsed = Date.now() - createdTime.current;
      const remainingTime = Math.max(0, 5000 - timeElapsed); // 5 seconds total duration

      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for animation to complete before removing
        setTimeout(onClose, 300);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [persistent, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${isVisible ? styles.slideIn : styles.slideOut}`}
      style={{ top: `${id}px` }}
    >
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        {persistent && (
          <button className={styles.okButton} onClick={handleClose}>
            <CheckIcon />
          </button>
        )}
        <button className={styles.closeButton} onClick={handleClose}>
          <XMarkIcon />
        </button>
      </div>
    </div>
  );
};

export default Notification; 