import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CodeBracketIcon, 
  CommandLineIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Snippets', href: '/', icon: CodeBracketIcon },
    { name: 'Regex Tester', href: '/regex', icon: CommandLineIcon },
    { name: 'JSON Formatter', href: '/json', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon }
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dev Helper</h1>
      </div>
      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <item.icon className={styles.icon} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 