import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/helpers.js';

const BillSplitter = ({ extractedText, onProceed, onBack }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');
 
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
              uniqueItems.set(itemKey, { id: crypto.randomUUID(), name, price });
            }
          }
        }
      });
      setItems(Array.from(uniqueItems.values()));
    };
    parseText();
  }, [extractedText]);

  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const taxAmount = parseFloat(tax) || 0;
    const tipAmount = parseFloat(tip) || 0;
    setTotal(subtotal + taxAmount + tipAmount);
  }, [items, tax, tip]);

  const handleAddItem = () => {
    const newItem = { id: crypto.randomUUID(), name: '', price: 0 };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => setItems(items.filter(item => item.id !== id));
 
  const handleItemChange = (id, field, value) => {
      setItems(items.map(item => {
          if (item.id === id) {
              const newValue = field === 'price' ? parseFloat(value) || 0 : value;
              return { ...item, [field]: newValue };
          }
          return item;
      }));
  };

  const handleProceed = () => {
    const taxAmount = parseFloat(tax) || 0;
    const tipAmount = parseFloat(tip) || 0;
    onProceed({ items, tax: taxAmount, tip: tipAmount });
  };

  return (
    <div className="card-design">
        <button onClick={onBack} className="back-button">&larr; Back</button>
        <h2 className="header-title">Receipt Items</h2>
        <p className="header-subtitle">List all the items on your receipt</p>

        <div className="item-list-design">
            {items.map(item => (
                <div key={item.id} className="item-row-design">
                    <input 
                        type="text" 
                        value={item.name} 
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        placeholder="Item name"
                        className="item-input-name"
                    />
                    <div className="price-section">
                        <span className="currency-symbol">$</span>
                        <input 
                            type="number" 
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                            className="item-input-price"
                            step="0.01"
                        />
                    </div>
                    <button onClick={() => handleDeleteItem(item.id)} className="delete-button">🗑️</button>
                </div>
            ))}
             <button onClick={handleAddItem} className="add-item-button">+ Add Item</button>
        </div>
        
        <div className="summary-section-design">
            <div className="tax-tip-grid">
                <div className="input-group-design">
                    <label>Tip</label>
                    <div className="price-section">
                        <span className="currency-symbol">$</span>
                        <input type="number" value={tip} onChange={(e) => setTip(e.target.value)} placeholder="0.00" step="0.01"/>
                    </div>
                </div>
                <div className="input-group-design">
                    <label>Tax</label>
                    <div className="price-section">
                        <span className="currency-symbol">$</span>
                        <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="0.00" step="0.01"/>
                    </div>
                </div>
            </div>
            <div className="total-row-design">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
            </div>
        </div>
        
        <button onClick={handleProceed} className="btn-design-primary">
          Continue
        </button>
    </div>
  );
};
export default BillSplitter;