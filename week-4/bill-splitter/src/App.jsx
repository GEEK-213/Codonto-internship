import React, { useState, useEffect, useRef } from 'react';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};


const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// --- Components ---

const LandingScreen = ({ onScan }) => {
  return (
    <div className="text-center">
      <h1>Bill Splitter</h1>
      <p>Upload a receipt and split the bill with ease.</p>
      <button onClick={onScan} className="btn">
        Scan a Receipt
      </button>
    </div>
  );
};

const OCRResult = ({ onTextExtracted, onBack, apiKey }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
        return;
      }
      setError('');
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    if (!apiKey) {
      setError('API Key is missing. Please add it to the code.');
      return;
    }

    setStatus('processing');
    setError('');

    try {
      const base64Image = await fileToBase64(file);
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{
          parts: [
            { text: "Extract all item names and their corresponding prices from this receipt image. List each item on a new line." },
            { inline_data: { mime_type: file.type, data: base64Image } }
          ]
        }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`API Error: ${errorBody.error.message}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text || text.trim() === '') {
        throw new Error("The AI couldn't find any text on the receipt. Please try a clearer image.");
      }

      onTextExtracted(text);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
      setStatus('error');
    }
  };

  return (
    <div className="text-center">
      <h2>Upload Receipt</h2>
      <div
        className="file-upload-area"
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/png, image/jpeg, image/webp"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Receipt preview" />
        ) : (
          <div className="file-upload-placeholder">
            <svg stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p>Click to select a file</p>
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {status === 'processing' ? (
        <div className="status-message">
           <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           Extracting with AI...
        </div>
      ) : (
        <button
          onClick={handleExtractText}
          className="btn btn-full-width"
          disabled={!file}
        >
          Extract Items
        </button>
      )}
      <button onClick={onBack} className="back-button">
        &larr; Go Back
      </button>
    </div>
  );
};

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
          // FIX: Correctly parse the price by removing currency symbols and normalizing decimal points.
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


// --- Main App Component ---

const App = () => {
  // IMPORTANT: Replace with your actual Gemini API Key.
  // Consider using environment variables for security.
  const apiKey = "AIzaSyDr5qmsPjwzgnx_epfQG6qB8l8dNr3EfWI";

  const [step, setStep] = useState('landing');
  const [extractedText, setExtractedText] = useState('');
  const [finalSummary, setFinalSummary] = useState(null);

  const handleScanReceipt = () => {
    setStep('ocr');
  };

  const handleTextExtracted = (text) => {
    setExtractedText(text);
    setStep('splitter');
  };

  const handleProceedToSummary = (summary) => {
    setFinalSummary(summary);
    setStep('summary');
  };

  const handleGoBackToOcr = () => {
    setStep('ocr');
    setExtractedText('');
  }

  const handleStartNew = () => {
    setStep('landing');
    setExtractedText('');
    setFinalSummary(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'ocr':
        return <OCRResult onTextExtracted={handleTextExtracted} onBack={handleStartNew} apiKey={apiKey} />;
      case 'splitter':
        return <BillSplitter extractedText={extractedText} onProceed={handleProceedToSummary} onBack={handleGoBackToOcr} apiKey={apiKey} />;
      case 'summary':
        return <FinalSummary summary={finalSummary} onStartNew={handleStartNew} apiKey={apiKey} />;
      case 'landing':
      default:
        return <LandingScreen onScan={handleScanReceipt} />;
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {renderStep()}
      </main>
      <footer className="footer">
        <p>Bill Splitter</p>
      </footer>
    </div>
  );
};

export default App;