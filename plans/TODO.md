## **Plan Breakdown**

### 1. **Basic Setup:**
- [x] Set up the **Electron** app with initial folder structure and configurations.
- [x] Install required dependencies for **React**, **SQLite**, **GraphQL**, and other necessary libraries.
- [x] Set up **sidebar navigation** (with Settings included in the sidebar) and the basic layout.
  - [x] with **Regex Tester**, **JSON Formatter**, **Snippet Manager** and **Settings**.
- [x] Set up **basic slideout error notification** system, with error messages that can automatically slide out or remain visible if needed.
  - [x] Slideout notifications that appear for error messages.
  - [x] Option for user to override and keep notifications visible.
  - [x] Error messages may also be associated with component highlighting to indicate error locations (e.g., in Regex Tester or JSON Formatter).
  
### 2. **Core Functionality (Basic Features):**
- [x] Set up the **GraphQL server** for managing app data (SQLite as the database).
- [x] Set up basic **state management** using **Context API**.
  
### 3. **Feature Implementation (in order):**

#### **Regex Tester**:
- [x] Implement regex testing functionality, including:
  - [x] Real-time regex pattern generation based on user input.
  - [x] Case sensitivity, multiline, and global flags toggleable via checkboxes.
  - [x] Real-time matching of strings against the regex pattern.
  - [x] Feedback if the regex is invalid (highlighting invalid regex areas).
  - [x] Show a real-time preview of the regex output based on the input string.
  - [x] Write tests for regex validation, real-time pattern generation, and error handling.
  - [x] Allow saving of regex patterns, with a name and optional tags.

#### **JSON Formatter**:
- [x] Implement JSON formatting functionality, including:
  - [x] Real-time JSON validation as text is entered (squiggly underline errors).
  - [x] Real-time JSON formatting and auto-correction for invalid JSON (focus on in-app editing).
  - [x] Syntax highlighting based on JSON format (different colors for property names and values).
  - [x] Clear notification for invalid JSON.
  - [x] No file saving or loading functionality (focused on in-app editing).
  - [x] Write tests for JSON validation and formatting.

#### **Snippet Manager**:
- [ ] Implement snippet storage and management functionality, including:
  - [ ] Allow users to store code snippets with customizable **titles**, **descriptions**, and **tags**.
  - [ ] Store snippets in a flat list and provide **search** functionality for names, descriptions, and tags.
  - [ ] Display **syntax highlighting** for code snippets based on the language.
  - [ ] Implement **search box** for arbitrary text search through titles and descriptions (tags will be a separate searchable area).
  - [ ] Provide the ability for users to label snippets with arbitrary names and tags.
  - [ ] Write tests for snippet storage, search, and retrieval.

### 4. **UI/UX Enhancements:**
- [ ] Polish the UI with subtle animations/tweaks.
  - [ ] Add small animations for smooth interactions (e.g., slideout notifications, transitions).
  - [ ] Focus on **clean minimalist UI**.
  - [ ] Implement theme support (light/dark mode) with system preference detection.
- [ ] Test and refine the error handling system:
  - [ ] Ensure **slideout notifications** work correctly, with error messages able to stay visible if required.
  - [ ] Implement **component highlighting** to indicate specific error areas in components.

### 5. **Testing and Refinement:**
- [ ] Continue developing **unit tests** for each module as they are built:
  - [ ] Write tests for Regex Tester, JSON Formatter, and Snippet Manager.
- [ ] Perform **integration and end-to-end tests** for the app as a whole.
  - [ ] Ensure modules interact smoothly together (Regex, JSON, Snippets).
- [ ] Refine the user experience based on feedback and discovered issues.
  - [ ] Fix any bugs discovered during testing.
  - [ ] Address any user experience challenges identified during testing.
