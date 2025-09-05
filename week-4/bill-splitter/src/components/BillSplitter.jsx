import React, { useState } from "react";

export default function BillSplitter({ extractedText, onBack }) {
  const [people, setPeople] = useState(2);
  const [splitMode, setSplitMode] = useState("even");

  const items = extractedText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !["total", "discount", "payment", "subtotal", "gst", "tax", "upi", "order", "shop", "no", "number"]
      .some(word => line.toLowerCase().includes(word)))
    .map(line => {
      const match = line.match(/(.+?)\s*₹?(\d+(?:\.\d+)?)/);
      return match ? { name: match[1].trim(), price: parseFloat(match[2]) } : null;
    })
    .filter(Boolean);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Bill Splitter 🧾</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Extracted Items</h3>
        <ul className="mt-2 space-y-1">
          {items.length > 0 ? (
            items.map((item, i) => (
              <li key={i} className="flex justify-between border-b py-1">
                <span>{item.name}</span>
                <span>₹{item.price.toFixed(2)}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No valid items found.</li>
          )}
        </ul>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Total: ₹{total.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Number of People:</label>
        <input
          type="number"
          value={people}
          min="1"
          onChange={e => setPeople(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
      </div>

      <div className="mb-4">
        <label className="font-medium">Split Mode:</label>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setSplitMode("even")}
            className={`px-4 py-2 rounded ${splitMode === "even" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Split Evenly
          </button>
          <button
            onClick={() => setSplitMode("items")}
            className={`px-4 py-2 rounded ${splitMode === "items" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            By Items
          </button>
        </div>
      </div>

      {splitMode === "even" ? (
        <div className="mt-4">
          <p className="text-lg font-semibold">
            Each person pays: ₹{(total / people).toFixed(2)}
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Per Item Share</h3>
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.name}</span>
                <span>₹{(item.price / people).toFixed(2)} each</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        ⬅ Go Back
      </button>
    </div>
  );
}
