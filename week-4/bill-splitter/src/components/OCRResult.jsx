import React, { useState, useRef } from 'react';
import { fileToBase64 } from '../utils/helpers.js';

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
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
      setError('API Key is missing. Please add it to the App.jsx file.');
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
    <div className="card-design text-center">
        <button onClick={onBack} className="back-button">&larr; Back</button>
      <h2 className="header-title">Upload Receipt</h2>
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
          <img src={imagePreview} alt="Receipt preview" className="image-preview" />
        ) : (
          <div className="file-upload-placeholder">
            <svg stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <p>Click to upload a receipt</p>
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {status === 'processing' ? (
        <div className="status-message">
           <div className="spinner"></div>
           Extracting with AI...
        </div>
      ) : (
        <button
          onClick={handleExtractText}
          className="btn-design-primary"
          disabled={!file}
        >
          Extract Items
        </button>
      )}
    </div>
  );
};

export default OCRResult;