import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/helpers.js';

const BillSplitter = ({ extractedText, onProceed, onBack, apiKey }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [people, setPeople] = useState(2);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [error, setError] = useState('');

 
  useEffect(() => {
    const parseText = () => {
      if (!extractedText) return;
      const lines = extractedText.split('\n');
      const uniqueItems = new Map();
      const itemRegex = /(.+?)\s+([$₹€]?\s?\d+[.,]\d{2})/;

      lines.forEach(line => {
        const match = line.match(itemRegex);
        if (match) {
          const name = match[1].trim();
          const priceString = match[2].replace(/[$,₹€\s]/g, '').replace(',', '.');
          const price = parseFloat(priceString);

          if (!isNaN(price) && price > 0) {
            const itemKey = `${name}-${price}`;
            if (!uniqueItems.has(itemKey)) {
              uniqueItems.set(itemKey, {
                id: crypto.randomUUID(),
                name: name,
                price: price,
                category: 'Uncategorized'
              });
            }
          }
        }
      });
      setItems(Array.from(uniqueItems.values()));
    };
    parseText();
  }, [extractedText]);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  }, [items]);

  const handleCategorize = async () => {
    if (!apiKey) {
      setError("API Key is missing. Please add it to the code.");
      return;
    }
    setIsCategorizing(true);
    setError('');

    const itemList = items.map(item => item.name).join(', ');
    const prompt = `Categorize these items: ${itemList}. Respond with a JSON object where keys are item names and values are categories like 'Food', 'Drink', or 'Other'. Example: {"Burger": "Food", "Coke": "Drink"}`;

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('API request failed');

      const result = await response.json();
      const categoryData = JSON.parse(result.candidates[0].content.parts[0].text);

      setItems(prevItems =>
        prevItems.map(item => ({
          ...item,
          category: categoryData[item.name] || 'Other'
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Couldn't categorize items. Please try again.");
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleProceed = () => {
    const perPersonAmount = total > 0 && people > 0 ? total / people : 0;
    onProceed({ items, total, people, perPersonAmount });
  };


  return (
    <div>
      <h2 className="text-center">Split the Bill</h2>
      <div className="item-list">
        <ul>
          {items.map(item => (
            <li key={item.id} className="item">
              <div>
                <span className="item-name">{item.name}</span>
                <span className="item-category">{item.category}</span>
              </div>
              <span className="item-price">{formatCurrency(item.price)}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleCategorize}
        disabled={isCategorizing || items.length === 0}
        className="btn btn-secondary btn-full-width"
      >
        {isCategorizing ? "Categorizing..." : "✨ AI Categorize Items"}
      </button>
      {error && <p className="error-message text-center">{error}</p>}

      <div className="total-section">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <div className="input-group">
        <label>How many people are splitting?</label>
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
          className="input-field"
        />
      </div>

      <button onClick={handleProceed} className="btn btn-full-width">
        Proceed to Summary
      </button>
      <button onClick={onBack} className="back-button btn-full-width">
        &larr; Scan a different receipt
      </button>
    </div>
  );
};

export default BillSplitter;