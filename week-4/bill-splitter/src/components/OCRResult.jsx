import React from "react";

export default function OCRResult({ text }) {
  return (
    <div className="p-4 mt-4 border rounded-lg bg-white">
      <h2 className="font-bold mb-2">OCR Output</h2>
      <pre className="whitespace-pre-wrap">{text}</pre>
    </div>
  );
}
