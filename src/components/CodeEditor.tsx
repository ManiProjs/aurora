import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

export default function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <CodeMirror
      value={value}
      height="260px"
      extensions={[css()]}
      theme={oneDark}
      onChange={(value: string) => {
        onChange(value);
      }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        autocompletion: true,
      }}
      className="
        overflow-hidden
        rounded-xl
        border
        border-white/10
      "
    />
  );
}
