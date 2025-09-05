// components/FinalSummary.jsx
import React from "react";

export default function FinalSummary({ items, total, onBack }) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Final Summary</h2>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>{item.name}</span>
            <span>₹{item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-semibold">Total: ₹{total.toFixed(2)}</p>
      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        ⬅ Back
      </button>
    </div>
  );
}
