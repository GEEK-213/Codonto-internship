import React from "react";

export default function FinalSummary({ shares, restart }) {
  return (
    <div className="p-4 mt-4 border rounded-lg bg-white">
      <h2 className="font-bold mb-2">Final Split</h2>
      <ul className="space-y-3">
        {shares.map((p, idx) => (
          <li key={idx} className="border-b pb-2">
            <strong>{p.name}</strong>: ₹{p.total.toFixed(2)}
            <ul className="ml-4 list-disc">
              {p.items.map((it, i) => (
                <li key={i}>
                  {it.name} – ₹{it.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <button
        onClick={restart}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start Over
      </button>
    </div>
  );
}
