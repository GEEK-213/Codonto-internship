import React, { useState } from "react";

export default function OCRResult({ onNext }) {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5174/api/extract", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setExtractedText(data.output || "No text found");
    } catch (err) {
      console.error(err);
      setExtractedText("Error extracting text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Receipt</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

      {loading && <p className="text-blue-600 font-semibold">Extracting items...</p>}

      {extractedText && (
        <>
          <h3 className="text-lg font-semibold mt-4">Extracted Text</h3>
          <pre className="bg-gray-100 p-3 rounded mt-2">{extractedText}</pre>
          <button
            onClick={() => onNext(extractedText)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}
