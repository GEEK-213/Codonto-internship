import React from "react";

export default function FinalSummary({ items, total, onRestart }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Final Summary</h2>

      <ul className="mb-4 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>{item.name}</span>
            <span>₹{item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <p className="font-semibold mb-4">Total: ₹{total.toFixed(2)}</p>

      <button
        onClick={onRestart}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Restart
      </button>
    </div>
  );
}
