import React, { useState } from "react";
import Tesseract from "tesseract.js";

export default function OCRUploader({ onExtract }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await Tesseract.recognize(file, "eng");
      onExtract(data.text);
    } catch (err) {
      console.error(err);
      setError("❌ OCR failed. Try another image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-700 mb-4 text-center">
        Upload a receipt (JPG/PNG) and let AI extract the text.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        className="w-full p-2 border rounded-lg"
      />

      {loading && <p className="text-blue-600 mt-4 text-center">⏳ Processing…</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
}
