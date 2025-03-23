import React from 'react';
import styles from './Page.module.css';

const Snippets: React.FC = () => {
  const testNotifications = () => {
    // Test auto-dismissing notifications
    (window as any).showNotification('Successfully saved snippet!', 'success');
    setTimeout(() => {
      (window as any).showNotification('Invalid code format detected', 'error');
    }, 1000);
    setTimeout(() => {
      (window as any).showNotification('Consider adding tags to your snippet', 'warning');
    }, 2000);

    // Test persistent notification
    setTimeout(() => {
      (window as any).showNotification(
        'Your snippet contains sensitive data. Are you sure you want to save it?Your snippet contains sensitive data. Are you sure you want to save it?Your snippet contains sensitive data. Are you sure you want to save it?Your snippet contains sensitive data. Are you sure you want to save it?',
        'warning',
        true
      );
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Code Snippets</h1>
      <div className={styles.content}>
        <p className={styles.text}>Your code snippets will appear here.</p>
        <button 
          onClick={testNotifications}
          className={styles.button}
        >
          Test Notifications
        </button>
      </div>
    </div>
  );
};

export default Snippets; 