// src/components/LandingScreen.jsx
import React, { useState } from "react";
import Tesseract from "tesseract.js";

export default function LandingScreen({ onTextExtracted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await Tesseract.recognize(file, "eng");
      onTextExtracted(data.text);
    } catch (err) {
      console.error("OCR failed:", err);
      setError(" Failed to process image. Try another one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white px-6">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold mb-4">Bill Splitter 🧾</h1>
        <p className="mb-6 text-gray-600">
          Upload a receipt (JPEG/PNG) and let AI extract the text for splitting.
        </p>

        <label className="cursor-pointer inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300">
          Upload Receipt
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {loading && (
          <p className="mt-4 text-purple-700 font-semibold animate-pulse">
            🔍 Processing your receipt...
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600 font-semibold">{error}</p>
        )}

        <p className="mt-6 text-sm text-gray-500">
          Supported formats: JPG, PNG, Screenshot
        </p>
      </div>
    </div>
  );
}
