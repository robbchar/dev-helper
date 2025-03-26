export interface RegexPattern {
  id: string;
  name: string;
  pattern: string;
  testString?: string;
  tags: string[];
  flags: {
    caseInsensitive: boolean;
    multiline: boolean;
    global: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SaveRegexPatternInput {
  name: string;
  pattern: string;
  testString?: string;
  tags: string[];
  flags: {
    caseInsensitive: boolean;
    multiline: boolean;
    global: boolean;
  };
} 