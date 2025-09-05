import React from "react";

export default function ItemExtractor({ items }) {
  return (
    <div className="p-4 mt-4 border rounded-lg bg-white">
      <h2 className="font-bold mb-2">Extracted Items</h2>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} className="flex justify-between">
            <span>{it.name}</span>
            <span>₹{it.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
