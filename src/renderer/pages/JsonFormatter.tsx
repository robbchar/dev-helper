import React from 'react';
import styles from './Page.module.css';

const JsonFormatter: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>JSON Formatter</h1>
      <div className={styles.content}>
        <p className={styles.text}>Format and validate your JSON here.</p>
      </div>
    </div>
  );
};

export default JsonFormatter; 