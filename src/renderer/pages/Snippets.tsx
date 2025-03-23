import React from 'react';
import styles from './Page.module.css';

const Snippets: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Code Snippets</h1>
      <div className={styles.content}>
        <p className={styles.text}>Your code snippets will appear here.</p>
      </div>
    </div>
  );
};

export default Snippets; 