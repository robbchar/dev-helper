import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Snippets from './pages/Snippets';
import RegexTester from './pages/RegexTester';
import JsonFormatter from './pages/JsonFormatter';
import Settings from './pages/Settings';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Sidebar />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Snippets />} />
            <Route path="/regex" element={<RegexTester />} />
            <Route path="/json" element={<JsonFormatter />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 