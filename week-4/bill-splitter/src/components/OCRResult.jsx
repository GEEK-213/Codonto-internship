// components/OCRResult.jsx
import React, { useState } from "react";
import { extractTextFromImage } from "../utils/openrouter";

export default function OCRResult({ onExtract, onBack }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");

    const reader = new FileReader();
reader.onload = async () => {
  const base64 = reader.result;
  setLoading(true);
  try {
    const response = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image: base64 }),
    });
    const data = await response.json();
    onExtract(data.text);
  } catch (err) {
    console.error(err);
    setError("Failed to extract text. Try again.");
  } finally {
    setLoading(false);
  }
};
reader.readAsDataURL(selectedFile);

  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Receipt</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {file && <p className="mb-2">Selected: {file.name}</p>}
      {loading && <p className="text-blue-600">Extracting items...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        ⬅ Back
      </button>
    </div>
  );
}
