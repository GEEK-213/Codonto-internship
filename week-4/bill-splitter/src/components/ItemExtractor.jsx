import React, { useEffect, useState } from "react";

function ItemExtractor({ text, onItemsExtracted }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!text) return;

    const lines = text.split("\n");
    const extracted = [];

    lines.forEach((line) => {
      const match = line.match(/(.+?)\s+(\d+\.\d{2})$/);
      if (match) {
        extracted.push({ name: match[1].trim(), price: parseFloat(match[2]) });
      }
    });

    setItems(extracted);
    onItemsExtracted(extracted);
  }, [text]);

  if (!items.length) return null;

  return (
    <div className="mb-4">
      <h2 className="font-semibold mb-2">🛒 Extracted Items</h2>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{item.name}</span>
            <span>₹{item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemExtractor;
