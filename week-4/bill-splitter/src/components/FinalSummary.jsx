import React from 'react';
import { formatCurrency } from '../utils/helpers.js';

const FinalSummary = ({ summary, onStartNew, onBack }) => {
  const { individualTotals = [], billTotal = 0 } = summary || {};

  const handleShare = () => {
    let shareText = "Bill Split Summary:\n";
    individualTotals.forEach(person => {
      shareText += `${person.name}: ${formatCurrency(person.amount)}\n`;
    });
    shareText += `\nTotal Bill: ${formatCurrency(billTotal)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Bill Split Summary',
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <div className="card-design text-center">
      <h2 className="header-title">Split Summary</h2>
      <p className="header-subtitle">Here is how you should split this bill:</p>
      
      <div className="summary-list-design">
        {individualTotals.map((person, index) => (
            <div key={index} className="summary-row-design">
                <span>{person.name}</span>
                <span>{formatCurrency(person.amount)}</span>
            </div>
        ))}
      </div>
      
      <div className="total-row-design final-total">
          <span>Total:</span>
          <span>{formatCurrency(billTotal)}</span>
      </div>

      <button onClick={handleShare} className="btn-design-primary">
        Share
      </button>

      <button onClick={onBack} className="btn-design-secondary">
        Go Back to Split
      </button>

      <button onClick={onStartNew} className="btn-design-secondary">
        Back Home
      </button>
    </div>
  );
};

export default FinalSummary;