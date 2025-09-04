import React, { useState } from "react";
import FileUpload from "./Fileupload";
import OCRResult from "./OCRResult";
import ItemExtractor from "./ItemExtractor";
import BillCalculator from "./BillCalculator";

function BillSplitter() {
  const [ocrText, setOcrText] = useState("");
  const [items, setItems] = useState([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-100 to-pink-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">📄 Bill Splitter</h1>

        <FileUpload onTextExtracted={setOcrText} />
        <OCRResult text={ocrText} />
        <ItemExtractor text={ocrText} onItemsExtracted={setItems} />
        {items.length > 0 && <BillCalculator items={items} />}
      </div>
    </div>
  );
}

export default BillSplitter;
