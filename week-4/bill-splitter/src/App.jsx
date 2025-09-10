import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import OCRResult from './components/OCRResult';
import BillSplitter from './components/BillSplitter';
import FinalSummary from './components/FinalSummary';

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