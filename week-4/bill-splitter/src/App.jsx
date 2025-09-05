// App.jsx
import React, { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import OCRResult from "./components/OCRResult";
import BillSplitter from "./components/BillSplitter";

function App() {
  const [screen, setScreen] = useState("landing");
  const [extractedText, setExtractedText] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      {screen === "landing" && <LandingScreen onUpload={() => setScreen("ocr")} />}
      {screen === "ocr" && (
        <OCRResult
          onExtract={(text) => {
            setExtractedText(text);
            setScreen("splitter");
          }}
          onBack={() => setScreen("landing")}
        />
      )}
      {screen === "splitter" && (
        <BillSplitter
          extractedText={extractedText}
          onBack={() => setScreen("ocr")}
        />
      )}
    </div>
  );
}

export default App;
