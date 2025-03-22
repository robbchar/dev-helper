# Developer Dashboard App Plan

## **Description**
The Developer Dashboard app is a lightweight, modular application designed to provide a suite of useful developer tools. It includes a **Regex Tester**, **JSON Formatter**, and **Snippet Manager**. These features are designed to improve the productivity and convenience of developers by allowing them to quickly test and store their code snippets, work with JSON data, and test regular expressions in a seamless, user-friendly interface. 

The app is built using **Electron**, providing a native desktop experience, and is designed with a minimalist UI. The app will store data in **SQLite** and interact with it through a **GraphQL** API. The layout follows a **VSCode-style navigation** with a sidebar for easy module access.

## **Core Features**
### 1. **Regex Tester**
   - Allows users to input strings and patterns.
   - Real-time regex pattern generation and preview.
   - Option for case sensitivity, multiline, and global flags.
   - Regex validation with real-time feedback and error highlighting.

### 2. **JSON Formatter**
   - Text editor for JSON formatting with syntax highlighting.
   - Real-time JSON validation with squiggly underline errors and hints.
   - Automatically formatted on paste or edit.
   - No file save/load functionality—focused on in-app editing.

### 3. **Snippet Manager**
   - Allows users to store code snippets with customizable **titles**, **descriptions**, and **tags**.
   - **Search functionality** for snippet names and tags.
   - **Syntax highlighting** for code snippets based on language.
   - All data stored in SQLite with GraphQL for data access.
   - Error handling with **slideout notifications** and **component highlighting** for validation.

## **Navigation**
   - **VSCode-style layout** with a **sidebar** for modules (Regex Tester, JSON Formatter, Snippet Manager).
   - **Settings** page accessible from the top navigation bar.

## **Data Storage**
   - **SQLite** for storing all user data (regex patterns, snippets, JSON formatter settings).
   - **GraphQL** as the single method to access and manipulate data.

## **UI Design**
   - **Minimalist UI** with subtle animations and tweaks added later.
   - Use **little animations** for smooth interactions (e.g., slideout notifications, transitions).

## **Error Handling**
   - **Slideout notifications** for error messages with the ability to override and keep them visible.
   - **Component highlighting** to show the error location (e.g., in Regex or JSON editor).

## **Tools and Technologies**
   - **Electron**: Framework for building the cross-platform desktop app.
   - **SQLite**: Lightweight database for storing app data.
   - **GraphQL**: API for querying and manipulating app data.
   - **React**: UI library for building the app’s frontend.
   - **Redux/Context API**: State management (Context API for simplicity).
   - **Node.js**: Backend server to handle GraphQL queries.
   - **React Syntax Highlighter**: For syntax highlighting in the Snippet Manager.
   - **CodeMirror**: For editing and formatting JSON data.
   - **RegExp APIs**: For regex pattern matching and testing.

## **Future Enhancements**
   - Add animations or visual tweaks for user interaction after core functionality is implemented.
   - Potentially expand the app with new modules or features, if needed.


