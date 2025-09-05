import React, { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import OCRResult from "./components/OCRResult";
import BillSplitter from "./components/BillSplitter";
import FinalSummary from "./components/FinalSummary";

export default function App() {
  const [screen, setScreen] = useState("landing"); 
  const [extractedText, setExtractedText] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  
  const handleStart = () => setScreen("ocr");

  const handleOCRNext = (text) => {
    setExtractedText(text);
    setScreen("split");
  };

  const handleBackToOCR = () => setScreen("ocr");


  const handleFinish = (finalItems, finalTotal) => {
    setItems(finalItems);
    setTotal(finalTotal);
    setScreen("summary");
  };


  const handleRestart = () => {
    setExtractedText("");
    setItems([]);
    setTotal(0);
    setScreen("landing");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {screen === "landing" && <LandingScreen onStart={handleStart} />}
      {screen === "ocr" && <OCRResult onNext={handleOCRNext} />}
      {screen === "split" && (
        <BillSplitter
          extractedText={extractedText}
          onBack={handleBackToOCR}
        />
      )}
      {screen === "summary" && (
        <FinalSummary items={items} total={total} onRestart={handleRestart} />
      )}
    </div>
  );
}
