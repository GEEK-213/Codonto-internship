import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { cleanOCRText } from "../utils/cleanOCR";
import ItemExtractor from "./ItemExtractor";

export default function BillSplitter() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      const cleaned = cleanOCRText(data.text);
      setText(cleaned);
    } catch (err) {
      console.error("OCR failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bill Splitter 🧾</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {loading && <p className="text-blue-600">Processing image...</p>}

      {text && (
        <>
          <div className="mt-4 p-3 border rounded-lg bg-white">
            <h2 className="font-bold mb-2">OCR Output</h2>
            <pre className="whitespace-pre-wrap">{text}</pre>
          </div>

          <ItemExtractor text={text} />
        </>
      )}
    </div>
  );
}
