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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);
};



const LandingScreen = ({ onScan }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Bill Splitter</h1>
      <p className="text-gray-600 mb-8">Upload a receipt and split the bill with ease.</p>
      <button 
        onClick={onScan}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
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
      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
          setError('API Key is missing. Please add it to the code.');
          return;
      }

      setStatus('processing');
      setError('');

      try {
          const base64Image = await fileToBase64(file);
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
          
          const payload = {
              contents: [{
                  parts: [
                      { text: "Extract all text from this receipt image. Focus on item names and prices." },
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
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Receipt</h2>
      <div 
        className={`w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center mb-4 ${
          imagePreview ? '' : 'bg-gray-50'
        }`}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Receipt preview" className="max-w-full max-h-full rounded-lg object-contain" />
        ) : (
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p>Click to select a file</p>
          </div>
        )}
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {status === 'processing' ? (
        <div className="flex items-center justify-center text-blue-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Extracting with AI.
        </div>
      ) : (
        <button
          onClick={handleExtractText}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50"
          disabled={!file}
        >
          Extract Items
        </button>
      )}
      <button onClick={onBack} className="mt-4 text-gray-600 hover:text-gray-800 text-sm">
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
            const lines = extractedText.split('\n');
            const parsedItems = [];
            const itemRegex = /(.+?)\s+([$]?\d+\.\d{2})/;

            lines.forEach(line => {
                const match = line.match(itemRegex);
                if (match) {
                    parsedItems.push({
                        id: crypto.randomUUID(),
                        name: match[1].trim(),
                        price: parseFloat(match[2].replace('$', '')),
                        category: 'Uncategorized'
                    });
                }
            });
            setItems(parsedItems);
        };
        parseText();
    }, [extractedText]);
    
    useEffect(() => {
      const newTotal = items.reduce((sum, item) => sum + item.price, 0);
      setTotal(newTotal);
    }, [items]);
    
    const handleCategorize = async () => {
        if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
            setError("API Key is missing. Please add it to the code.");
            return;
        }
        setIsCategorizing(true);
        setError('');

        const itemList = items.map(item => item.name).join(', ');
        const prompt = `Categorize the following comma-separated list of items from a receipt into simple categories like 'Food', 'Drink', 'Dessert', 'Snack', or 'Other'. For each item, provide only the category name. The items are: ${itemList}. Respond with a JSON object where keys are the item names and values are their corresponding category. For example: {"Burger": "Food", "Coke": "Drink"}`;
        
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
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
        const perPersonAmount = total / people;
        onProceed({ items, total, people, perPersonAmount });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Split the Bill</h2>
            <div className="mb-4">
                <ul className="max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-lg border">
                    {items.map(item => (
                        <li key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <div>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-xs ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{item.category}</span>
                            </div>
                            <span className="font-mono">{formatCurrency(item.price)}</span>
                        </li>
                    ))}
                </ul>
            </div>
             <button
                onClick={handleCategorize}
                disabled={isCategorizing || items.length === 0}
                className="w-full flex items-center justify-center bg-purple-100 text-purple-800 font-semibold py-2 px-4 rounded-lg hover:bg-purple-200 disabled:opacity-50 mb-4"
            >
                {isCategorizing ? "Categorizing..." : "✨ AI Categorize Items"}
            </button>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="flex justify-between items-center text-xl font-bold my-4 py-4 border-t-2 border-b-2">
                <span>Total:</span>
                <span className="font-mono">{formatCurrency(total)}</span>
            </div>
            
            <div className="my-4">
                <label className="block text-center text-gray-700 font-medium mb-2">How many people are splitting?</label>
                <input 
                    type="number" 
                    value={people} 
                    onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2 text-center text-lg border rounded-lg"
                />
            </div>

            <button onClick={handleProceed} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg">
                Proceed to Summary
            </button>
            <button onClick={onBack} className="mt-4 text-gray-600 hover:text-gray-800 text-sm w-full text-center">
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
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      setError("API Key is missing. Please add it to the code.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setShareMessage('');

    const prompt = `Create a friendly and concise message to share in a group chat for splitting a bill. The total was ${formatCurrency(total)}, split between ${people} people. Each person owes ${formatCurrency(perPersonAmount)}. Keep it under 280 characters.`;

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
        const generatedText = result.candidates[0].content.parts[0].text;
        setShareMessage(generatedText.trim());

    } catch (err) {
        console.error(err);
        setError("Sorry, couldn't generate the message right now.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (shareMessage) {
      
        const ta = document.createElement('textarea');
        ta.value = shareMessage;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
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


const App = () => {
 
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
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg mx-auto">
        <main className="bg-white rounded-xl shadow-lg p-8 w-full transition-all duration-300">
          {renderStep()}
        </main>
        <footer className="text-center mt-6 text-sm text-gray-500">
            <p>Bill Splitter </p>
        </footer>
      </div>
    </div>
  );
};

export default App;

