import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import Sidebar from './components/Layout/Sidebar';
import Snippets from './pages/Snippets';
import RegexTester from './pages/RegexTester';
import JsonFormatter from './pages/JsonFormatter';
import Settings from './pages/Settings';
import NotificationManager from './components/Notification/NotificationManager';
import { ThemeProvider } from './contexts';
import { SnippetProvider } from './contexts/SnippetContext';
import { RegexTesterProvider } from './contexts/RegexTesterContext';
import { JsonFormatterProvider } from './contexts/JsonFormatterContext';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <JsonFormatterProvider>
          <RegexTesterProvider>
            <SnippetProvider>
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
                  <NotificationManager />
                </div>
              </Router>
            </SnippetProvider>
          </RegexTesterProvider>
        </JsonFormatterProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App; 