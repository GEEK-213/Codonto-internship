import React from "react";

export default function FileUpload({ onFile }) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 text-center">
      <h2 className="font-bold mb-2">Upload Receipt</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile(e.target.files[0])}
      />
    </div>
  );
}
