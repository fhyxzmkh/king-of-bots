import { useRef } from "react";
import Editor from "@monaco-editor/react";

interface EditorComponentProps {
  height?: string;
  defaultLanguage?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function EditorComponent({
  height = "20vh",
  defaultLanguage = "Java",
  value,
  onChange,
}: EditorComponentProps) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    if (onChange) {
      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });
    }
  };

  return (
    <Editor
      height={height}
      defaultLanguage={defaultLanguage}
      value={value}
      onMount={handleEditorDidMount}
    />
  );
}
