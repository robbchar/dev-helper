import React from 'react';
import styles from './Page.module.css';

const Settings: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.content}>
        <p className={styles.text}>Configure your application settings here.</p>
      </div>
    </div>
  );
};

export default Settings; 