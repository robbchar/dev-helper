import React, { createContext, useContext, useState, ReactNode } from 'react';

interface JsonFormatterContextType {
  value: string;
  setValue: (value: string) => void;
}

const JsonFormatterContext = createContext<JsonFormatterContextType | undefined>(undefined);

export const JsonFormatterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [value, setValue] = useState('');

  return (
    <JsonFormatterContext.Provider value={{ value, setValue }}>
      {children}
    </JsonFormatterContext.Provider>
  );
};

export const useJsonFormatter = () => {
  const context = useContext(JsonFormatterContext);
  if (context === undefined) {
    throw new Error('useJsonFormatter must be used within a JsonFormatterProvider');
  }
  return context;
}; 