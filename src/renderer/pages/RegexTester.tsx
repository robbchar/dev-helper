import React from 'react';
import styles from './Page.module.css';

const RegexTester: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Regex Tester</h1>
      <div className={styles.content}>
        <p className={styles.text}>Test your regular expressions here.</p>
      </div>
    </div>
  );
};

export default RegexTester; 