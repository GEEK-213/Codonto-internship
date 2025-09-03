import React, { useState } from "react";
import Tesseract from "tesseract.js";

export default function BillSplitter() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng");
      const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

      const parsedItems = lines
        .map(line => {
          
          const match = line.match(/(\d+)?\s*([A-Za-z ]+)\s*[₹]?\s?(\d+(\.\d{1,2})?)$/);

          if (match) {
            const qty = parseInt(match[1]) || 1;
            const name = match[2].trim();
            const price = parseFloat(match[3]);

            const ignoreWords = ["total", "subtotal", "discount", "payment", "gst", "cgst", "sgst", "tax", "upi"];
            if (ignoreWords.some(word => name.toLowerCase().includes(word))) {
              return null;
            }

            if (price > 10000) return null;

        
            return {
              name: `${qty} x ${name}`,
              price: parseFloat(price),
              unitPrice: parseFloat(unitPrice),
              qty
            };
          }
          return null;
        })
        .filter(Boolean);

      setItems(parsedItems);
    } catch (err) {
      console.error("OCR Error:", err);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", background: "#fff3e6", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}> Bill Splitter</h2>
      <input type="file" accept="image/*" onChange={handleFileUpload} />

      {loading && <p> Extracting items...</p>}

      {items.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Extracted Items</h3>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {item.name} — ₹{item.price.toFixed(2)}
                {item.qty > 1 && <small> (₹{item.unitPrice} each)</small>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
