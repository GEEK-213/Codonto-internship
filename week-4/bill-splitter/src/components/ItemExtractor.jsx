import React from "react";
import PeopleSplitter from "./PeopleSplitter";

export default function ItemExtractor({ text }) {
  // Extract items with regex
  const lines = text.split("\n").filter((line) => line.trim());
  const items = lines
    .map((line) => {
      const match = line.match(/(.+?)\s+₹?([\d.]+)/);
      if (match) {
        return { name: match[1].trim(), price: parseFloat(match[2]) };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-3">Extracted Items</h2>
      <ul className="mb-4 list-disc pl-5">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.name} — ₹{item.price.toFixed(2)}
          </li>
        ))}
      </ul>

      {/* Pass items to PeopleSplitter */}
      <PeopleSplitter items={items} />
    </div>
  );
}
