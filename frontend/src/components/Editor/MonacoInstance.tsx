import { useRef } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
import { useExamStore } from "../../store/useExamStore";

export const MonacoInstance = () => {
  const editorRef = useRef<any>(null);
  // Pulling the current code and the update function from theZustand store
  const { currentQuestionIndex, questions, updateCode } = useExamStore();
  // Get the code specifically for the active question
  const currentCode = questions[currentQuestionIndex]?.code || "";
  const currentLanguage =
    questions[currentQuestionIndex]?.language || "javascript";

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  //Handle changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      // This fires on every keystroke, updating Zustand
      // leading to -> saveStatus="saving" -> AutoSave debounce
      updateCode(value);
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="vs-dark"
      language={currentLanguage}
      onMount={handleEditorDidMount}
      value={currentCode} // The editor now shows what's in our store
      onChange={handleEditorChange} //Bind the listener
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        // Using Lexend-compatible fonts for the editor code
        fontFamily: "'Fira Code', monospace",
        padding: { top: 16 },
        //Disable Autocomplete/IntelliSense Features
        quickSuggestions: false,
        suggestOnTriggerCharacters: false, // Disables suggestions after trigger chars like '.'
        snippetSuggestions: "none",
        wordBasedSuggestions: "off",
        parameterHints: { enabled: false },
      }}
    />
  );
};
