import React, { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import BillSplitter from "./components/BillSplitter";
import FinalSummary from "./components/FinalSummary";

export default function App() {
  const [step, setStep] = useState("landing");
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [splitEvenly, setSplitEvenly] = useState(false);

  const reset = () => {
    setPeople([]);
    setItems([]);
    setSplitEvenly(false);
    setStep("landing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-8">
        {step === "landing" && (
          <LandingScreen
            onStart={() => setStep("splitter")}
          />
        )}

        {step === "splitter" && (
          <BillSplitter
            people={people}
            setPeople={setPeople}
            items={items}
            setItems={setItems}
            splitEvenly={splitEvenly}
            setSplitEvenly={setSplitEvenly}
            onFinish={() => setStep("summary")}
          />
        )}

        {step === "summary" && (
          <FinalSummary
            people={people}
            items={items}
            splitEvenly={splitEvenly}
            onBack={() => setStep("splitter")}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}