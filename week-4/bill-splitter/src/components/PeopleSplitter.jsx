import React, { useState } from "react";

export default function PeopleSplitter({ items }) {
  const [people, setPeople] = useState(2);
  const [splitMethod, setSplitMethod] = useState("equal"); 
  const [assignments, setAssignments] = useState({});

  
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const perPerson = (total / people).toFixed(2);

  const handleAssign = (itemIndex, personIndex) => {
    setAssignments((prev) => ({
      ...prev,
      [itemIndex]: personIndex,
    }));
  };

  
  const itemBasedSplit = Array.from({ length: people }, (_, i) => {
    return items
      .filter((_, idx) => assignments[idx] === i)
      .reduce((sum, item) => sum + item.price, 0)
      .toFixed(2);
  });

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-bold mb-3">Split Between People</h2>

      {/* Controls */}
      <div className="mb-3">
        <label className="mr-2 font-medium">Number of People:</label>
        <input
          type="number"
          min="2"
          value={people}
          onChange={(e) => setPeople(parseInt(e.target.value))}
          className="w-16 border rounded px-2 py-1"
        />
      </div>

      <div className="mb-3">
        <label className="mr-2 font-medium">Split Method:</label>
        <select
          value={splitMethod}
          onChange={(e) => setSplitMethod(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="equal">Equal Split</option>
          <option value="items">By Items</option>
        </select>
      </div>

      {/* Show results */}
      {splitMethod === "equal" ? (
        <div className="font-semibold">
          Each Person Pays: ₹{perPerson}
        </div>
      ) : (
        <div>
          <h3 className="font-semibold mb-2">Assign Items:</h3>
          <ul className="mb-3 space-y-1">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>
                  {item.name} — ₹{item.price.toFixed(2)}
                </span>
                <select
                  className="ml-2 border rounded px-2 py-1"
                  onChange={(e) =>
                    handleAssign(idx, parseInt(e.target.value))
                  }
                >
                  <option value="">Assign</option>
                  {Array.from({ length: people }, (_, i) => (
                    <option key={i} value={i}>
                      Person {i + 1}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>

          <h3 className="font-semibold mb-2">Totals:</h3>
          {itemBasedSplit.map((amt, i) => (
            <p key={i}>
              Person {i + 1}: ₹{amt}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
