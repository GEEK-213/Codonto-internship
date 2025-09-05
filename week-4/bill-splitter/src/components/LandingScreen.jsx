import React from "react";

export default function LandingScreen({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-purple-700 mb-6">
        Bill Splitter 🧾
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload your bill, extract items, and split easily with friends.
      </p>
      <button
        onClick={onNext}
        className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition"
      >
        Get Started
      </button>
    </div>
  );
}
