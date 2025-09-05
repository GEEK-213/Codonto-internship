// components/LandingScreen.jsx
import React from "react";

export default function LandingScreen({ onUpload }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Bill Splitter 🧾</h1>
      <p className="mb-4 text-center">
        Upload your receipt image (JPG/PNG) and let AI extract the items for you.
      </p>
      <button
        onClick={onUpload}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload Receipt
      </button>
    </div>
  );
}
