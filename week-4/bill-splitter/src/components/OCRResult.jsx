import React, { useState } from 'react';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const OCRResult = ({ onOcrSuccess, onBack, apiKey }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!apiKey) {
      setError("Please enter your Gemini API key above to scan receipts.");
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid JPG or PNG image.');
      return;
    }
    
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setIsExtracting(true);

    try {
      const base64ImageData = await fileToBase64(file);
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{
          parts: [
            { text: "You are an expert receipt scanner. Extract every line item and its price from the provided image. Return only the raw text, with each item on a new line. Do not add any commentary or formatting." },
            { inlineData: { mimeType: file.type, data: base64ImageData } }
          ]
        }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const extractedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (extractedText && extractedText.trim()) {
        onOcrSuccess(extractedText.trim());
      } else {
        setError("Couldn't find any items on the receipt. Please try another image.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process the image. Check your API key and try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Upload Receipt</h2>
       {imagePreview && !error && (
        <div className="mb-4">
            <img src={imagePreview} alt="Receipt preview" className="rounded-lg shadow-md max-h-64 mx-auto" />
        </div>
       )}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <label htmlFor="receipt-upload" className={`w-full flex items-center justify-center px-4 py-6 bg-gray-50 text-blue-600 rounded-lg shadow-inner tracking-wide uppercase border border-dashed border-blue-400 cursor-pointer hover:bg-blue-100 ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <UploadIcon />
          <span className="text-base leading-normal">{isExtracting ? 'Extracting with AI...' : 'Select a file'}</span>
          <input id="receipt-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/png, image/jpeg" disabled={isExtracting} />
        </label>
        {isExtracting && (
          <div className="mt-4 w-full text-center">
             <div className="flex items-center justify-center text-blue-700">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
             </div>
          </div>
        )}
        {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}
      </div>
      <button onClick={onBack} className="mt-6 text-gray-600 hover:text-gray-800 transition-colors">
        &larr; Go Back
      </button>
    </div>
  );
};

export default OCRResult;

