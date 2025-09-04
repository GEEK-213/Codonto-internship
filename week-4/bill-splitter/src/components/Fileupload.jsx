import React, { useState } from "react";
import Tesseract from "tesseract.js";

function FileUpload({ onTextExtracted }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setLoading(true);
      setProgress(0);

      try {
        const { data } = await Tesseract.recognize(reader.result, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        onTextExtracted(data.text); 
      } catch (error) {
        console.error("OCR Error:", error);
        onTextExtracted(" OCR Failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file); 
  };

  return (
    <div className="mb-4">
      <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileUpload} />

      {loading && (
        <p className="mt-2 text-sm text-gray-600">
          Extracting text... {progress}%
        </p>
      )}
    </div>
  );
}

export default FileUpload;
