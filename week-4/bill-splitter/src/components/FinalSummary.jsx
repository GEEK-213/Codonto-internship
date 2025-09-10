import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers.js';

const FinalSummary = ({ summary, onStartNew, apiKey }) => {
  const { total = 0, people = 0, perPersonAmount = 0 } = summary || {};
  const [shareMessage, setShareMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);


  const handleGenerateMessage = async () => {
    if (!apiKey) {
      setError("API Key is missing. Please add it to the code.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setShareMessage('');

    const prompt = `Create a friendly, short message for a group chat to split a bill. Total: ${formatCurrency(total)}, split between ${people} people. Each owes ${formatCurrency(perPersonAmount)}.`;

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
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
      const generatedText = result.candidates[0].content.parts[0].text;
      setShareMessage(generatedText.trim());
    } catch (err) {
      console.error(err);
      setError("Sorry, couldn't generate the message right now.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!shareMessage) return;
    try {
      await navigator.clipboard.writeText(shareMessage);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };


  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">All Settled!</h2>
      <p className="text-gray-600 mb-6">Here's the final breakdown of your bill.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-left">
        <div className="flex justify-between items-center text-xl font-bold mb-4 border-b pb-3">
          <span>Total Bill:</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center text-lg mb-2">
          <span className="text-gray-600">Split between:</span>
          <span>{people} people</span>
        </div>
        <div className="flex justify-between items-center text-2xl font-bold mt-4 pt-4 border-t-2">
          <span>Each Person Pays:</span>
          <span className="text-green-600">{formatCurrency(perPersonAmount)}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
            onClick={handleGenerateMessage}
            disabled={isGenerating}
            className="w-full flex items-center justify-center bg-teal-100 text-teal-800 font-semibold py-3 px-4 rounded-lg hover:bg-teal-200 disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "🤖 Generate Share Message"}
        </button>
        
        {error && <p className="mt-2 text-red-500">{error}</p>}

        {shareMessage && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left relative">
            <textarea
                readOnly
                value={shareMessage}
                className="w-full h-24 bg-transparent border-0 resize-none text-gray-700 outline-none"
            />
             <button 
                onClick={handleCopyToClipboard}
                className="absolute top-2 right-2 bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md hover:bg-gray-300"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>

      <button onClick={onStartNew} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg">
        Split Another Bill
      </button>
    </div>
  );
};

export default FinalSummary;