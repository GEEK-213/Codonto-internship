import React, { useState, useRef } from 'react';
import { fileToBase64 } from '../utils/helpers.js';

const OCRResult = ({ onTextExtracted, onBack, apiKey }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // ... (Paste the handleFileChange and handleExtractText functions here) ...
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
           Extracting ...
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

export default OCRResult;