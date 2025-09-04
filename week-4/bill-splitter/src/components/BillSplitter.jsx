import { useState } from "react";
import FileUpload from "./FileUpload";
import RawTextViewer from "./RawTextViewer";
import ItemExtractor from "./ItemExtractor";
import PeopleSplitter from "./PeopleSplitter";
import { cleanOCRText } from "../utils/cleanOCR";

export default function BillSplitter() {
  const [rawText, setRawText] = useState("");
  const [cleanText, setCleanText] = useState("");

  const handleExtracted = (text) => {
    setRawText(text);
    setCleanText(cleanOCRText(text)); 
  };

  return (
    <div className="p-6 bg-orange-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🧾 Bill Splitter</h1>
      
      <FileUpload onTextExtracted={handleExtracted} />

      {rawText && <RawTextViewer text={rawText} />}
      {cleanText && <ItemExtractor text={cleanText} />}
      {cleanText && <PeopleSplitter text={cleanText} />}
    </div>
  );
}
