// src/components/OCRResult.jsx
import React from "react";

export default function OCRResult({ text, onBack, onContinue }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-6">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">📄 OCR Result</h2>
        <p className="mb-4 text-gray-600">
          Below is the extracted text from your receipt:
        </p>

        <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto border border-gray-300">
          <pre className="whitespace-pre-wrap text-sm text-gray-700">
            {text}
          </pre>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onBack}
            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow-md transition-all"
          >
            ⬅ Go Back
          </button>

          <button
            onClick={onContinue}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            Continue ➡
          </button>
        </div>
      </div>
    </div>
  );
}
