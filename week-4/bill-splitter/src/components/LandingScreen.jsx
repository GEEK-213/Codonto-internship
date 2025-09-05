import React from "react";

export default function LandingScreen({ onStart }) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Bill Splitter 🧾</h1>
      <p className="mb-6">
        Upload a receipt (JPG/PNG) and let AI extract the items automatically.
      </p>
      <button
        onClick={onStart}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Start
      </button>
    </div>
  );
}
