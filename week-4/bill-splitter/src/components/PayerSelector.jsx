import React, { useState } from "react";

export default function PayerSelector({ people, onNext, onBack }) {
  const [payer, setPayer] = useState(null);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <button
        onClick={onBack}
        className="text-blue-500 text-sm mb-3 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Select Payer 💳</h2>
      <p className="text-gray-600 mb-3">Who will pay the total bill?</p>

      <div className="grid grid-cols-2 gap-3">
        {people.map((person) => (
          <button
            key={person}
            onClick={() => setPayer(person)}
            className={`p-3 rounded-lg border text-center font-semibold ${
              payer === person
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {person}
          </button>
        ))}
      </div>

      {/* Continue */}
      <button
        disabled={!payer}
        onClick={() => onNext(payer)}
        className={`mt-6 w-full px-4 py-2 rounded text-white ${
          payer
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Continue ➡️
      </button>
    </div>
  );
}
