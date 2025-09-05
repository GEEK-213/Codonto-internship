// components/BillSplitter.jsx
import React, { useState } from "react";

export default function BillSplitter({ items, onGoBack }) {
  const [people, setPeople] = useState([]);
  const [personName, setPersonName] = useState("");
  const [splitResult, setSplitResult] = useState(null);

  // Add a new person
  const addPerson = () => {
    if (personName.trim() === "") return;
    setPeople([...people, { id: Date.now(), name: personName }]);
    setPersonName("");
  };

  // Split evenly among all people
  const splitEvenly = () => {
    if (people.length === 0) return;
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const share = (total / people.length).toFixed(2);

    setSplitResult(
      people.map((p) => ({
        name: p.name,
        amount: share,
      }))
    );
  };

  // Reset for editing
  const resetSplit = () => {
    setSplitResult(null);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Bill Splitter 🧾</h2>

      {!splitResult ? (
        <>
          {/* Add People Section */}
          <div className="mb-4">
            <label className="block font-medium">Add People</label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Person name"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="border rounded-lg p-2 flex-1"
              />
              <button
                onClick={addPerson}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* List of People */}
          {people.length > 0 && (
            <ul className="mb-4 list-disc pl-5">
              {people.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={splitEvenly}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Split Evenly
            </button>
            <button
              onClick={onGoBack}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Go Back
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Final Result */}
          <h3 className="text-lg font-semibold mb-2">Split Result 💰</h3>
          <ul className="mb-4">
            {splitResult.map((res, idx) => (
              <li key={idx}>
                {res.name}: <span className="font-bold">₹{res.amount}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <button
              onClick={resetSplit}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Edit Again
            </button>
            <button
              onClick={onGoBack}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Go Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
