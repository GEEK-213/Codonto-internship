import React, { useState, useEffect } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const BillSplitter = ({ extractedText, onProceed, onBack, apiKey }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [people, setPeople] = useState(2);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (extractedText) {
        const parsedItems = extractedText
            .split('\n')
            .map((line, index) => {
                const match = line.match(/(.*?)\s*([$€£]?\s*\d+[.,]\d{2})$/);
                if (match) {
                    const name = match[1].trim();
                    const price = parseFloat(match[2].replace(/[^0-9.]/g, ''));
                    if (name && !isNaN(price)) {
                        return { id: index, name, price, category: 'Uncategorized' };
                    }
                }
                return null;
            })
            .filter(Boolean);

        setItems(parsedItems);
        const calculatedTotal = parsedItems.reduce((sum, item) => sum + item.price, 0);
        setTotal(calculatedTotal);
    }
  }, [extractedText]);
  
  const handleCategorize = async () => {
    if (!apiKey) {
      setApiError("Please enter your Gemini API key above.");
      return;
    }
    if (items.length === 0) return;
    
    setIsCategorizing(true);
    setApiError(null);
    
    const itemNames = items.map(i => i.name).join(', ');
    const prompt = `You are an expert at categorizing restaurant receipts. Given the following list of items, categorize them into logical groups such as 'Food', 'Drink', 'Appetizer', 'Dessert', or 'Other'. Return ONLY a valid JSON object where keys are the exact item names and values are the categories. Do not include any other text or markdown formatting. Items: ${itemNames}`;
    
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const result = await response.json();
      const textResponse = result.candidates[0].content.parts[0].text;
      const jsonString = textResponse.replace(/```json|```/g, '').trim();
      const categories = JSON.parse(jsonString);

      setItems(currentItems => currentItems.map(item => ({
        ...item,
        category: categories[item.name] || item.category
      })));

    } catch (err) {
      console.error(err);
      setApiError("Failed to categorize items. The AI might be busy, or the response was invalid.");
    } finally {
      setIsCategorizing(false);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const handleProceed = () => {
    onProceed({ items, total, people, perPersonAmount: total > 0 && people > 0 ? total / people : 0 });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Split the Bill</h2>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-lg">Extracted Items</h3>
            <button 
                onClick={handleCategorize}
                disabled={isCategorizing || items.length === 0}
                className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {isCategorizing ? "Categorizing..." : "✨ Categorize Items"}
            </button>
        </div>
        
        {apiError && <p className="mb-4 text-center text-red-500 font-semibold">{apiError}</p>}
        
        <div className="max-h-60 overflow-y-auto mb-4 pr-2">
            {Object.keys(groupedItems).length > 0 ? Object.entries(groupedItems).map(([category, itemsInCategory]) => (
                <div key={category} className="mb-3">
                    <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">{category}</p>
                    {itemsInCategory.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-semibold text-gray-800">{formatCurrency(item.price)}</span>
                        </div>
                    ))}
                </div>
            )) : <p className="text-gray-500 text-center py-4">No valid items were found.</p>}
        </div>
        <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
            <span className="font-bold text-xl">Total</span>
            <span className="font-bold text-xl text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
        <label htmlFor="people" className="block text-lg font-medium text-gray-700 mb-2">How many people are splitting?</label>
        <div className="flex items-center">
            <button onClick={() => setPeople(p => Math.max(1, p - 1))} className="bg-gray-200 text-gray-700 font-bold p-3 rounded-l-lg hover:bg-gray-300">-</button>
            <input type="number" id="people" value={people} onChange={(e) => setPeople(parseInt(e.target.value, 10) || 1)} className="w-full text-center font-bold text-lg border-t border-b p-2 outline-none" min="1" />
            <button onClick={() => setPeople(p => p + 1)} className="bg-gray-200 text-gray-700 font-bold p-3 rounded-r-lg hover:bg-gray-300">+</button>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800 transition-colors">&larr; Re-scan</button>
        <button onClick={handleProceed} disabled={total <= 0} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-150 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">Calculate Split</button>
      </div>
    </div>
  );
};

export default BillSplitter;

