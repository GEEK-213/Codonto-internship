import React, { useState } from "react";
import OCRUploader from "./components/OCRResult";
import BillSplitter from "./components/BillSplitter";

export default function App() {
  const [extractedText, setExtractedText] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Bill Splitter 🧾</h1>

      {!extractedText ? (
        <OCRUploader onExtract={setExtractedText} />
      ) : (
        <BillSplitter extractedText={extractedText} onBack={() => setExtractedText("")} />
      )}
    </div>
  );
}
