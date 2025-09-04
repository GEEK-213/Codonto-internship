// src/components/RawTextViewer.jsx
export default function RawTextViewer({ text }) {
  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
      <h3>Extracted Raw Text</h3>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {text || "No text extracted yet."}
      </pre>
    </div>
  );
}
