import React from "react";

function OCRResult({ text }) {
  if (!text) return null;

  return (
    <div className="bg-gray-100 p-3 rounded-lg mb-4">
      <h2 className="font-semibold mb-2">📄 Raw OCR Text</h2>
      <pre className="text-sm whitespace-pre-wrap">{text}</pre>
    </div>
  );
}

export default OCRResult;
