import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import OCRResult from './components/OCRResult';
import BillSplitter from './components/BillSplitter';
import AssignItems from './components/AssignItems';
import FinalSummary from './components/FinalSummary';

const App = () => {

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY  ;

  const [step, setStep] = useState('landing');
  const [extractedText, setExtractedText] = useState('');
  const [billDetails, setBillDetails] = useState(null);
  const [finalSummary, setFinalSummary] = useState(null);

  const handleScanReceipt = () => setStep('ocr');

  const handleTextExtracted = (text) => {
    setExtractedText(text);
    setStep('splitter');
  };

  const handleProceedToAssigner = (details) => {
    setBillDetails(details);
    setStep('assigner');
  };

  const handleProceedToSummary = (summary) => {
    setFinalSummary(summary);
    setStep('summary');
  };
  
  const handleGoBackToSplitter = () => {
      setStep('splitter');
  }

  const handleGoBackToAssigner = () => {
      setStep('assigner');
  }

  const handleStartNew = () => {
    setStep('landing');
    setExtractedText('');
    setBillDetails(null);
    setFinalSummary(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'ocr':
        return <OCRResult onTextExtracted={handleTextExtracted} onBack={handleStartNew} apiKey={apiKey} />;
      case 'splitter':
        return <BillSplitter extractedText={extractedText} onProceed={handleProceedToAssigner} onBack={handleStartNew} />;
      case 'assigner':
        return <AssignItems billDetails={billDetails} onProceed={handleProceedToSummary} onBack={handleGoBackToSplitter} />;
      case 'summary':
     
        return <FinalSummary summary={finalSummary} onStartNew={handleStartNew} onBack={handleGoBackToAssigner} />;
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
      
    </div>
  );
};

export default App;