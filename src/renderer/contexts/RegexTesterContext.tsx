import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RegexFlags {
  caseInsensitive: boolean;
  multiline: boolean;
  global: boolean;
}

interface RegexTesterContextType {
  pattern: string;
  setPattern: (pattern: string) => void;
  testString: string;
  setTestString: (testString: string) => void;
  flags: RegexFlags;
  setFlags: (flags: RegexFlags) => void;
}

const RegexTesterContext = createContext<RegexTesterContextType | undefined>(undefined);

export const RegexTesterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<RegexFlags>({
    caseInsensitive: false,
    multiline: false,
    global: false
  });

  return (
    <RegexTesterContext.Provider value={{ 
      pattern, 
      setPattern, 
      testString, 
      setTestString, 
      flags, 
      setFlags 
    }}>
      {children}
    </RegexTesterContext.Provider>
  );
};

export const useRegexTester = () => {
  const context = useContext(RegexTesterContext);
  if (context === undefined) {
    throw new Error('useRegexTester must be used within a RegexTesterProvider');
  }
  return context;
}; 