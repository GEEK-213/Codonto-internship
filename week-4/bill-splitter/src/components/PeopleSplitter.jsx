import React, { useState } from "react";

export default function PeopleSplitter({ items, onSplit, goBack }) {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState("");

  const addPerson = () => {
    if (newPerson.trim()) {
      setPeople([...people, { name: newPerson.trim(), items: [] }]);
      setNewPerson("");
    }
  };

  const splitEvenly = () => {
    if (people.length === 0) return;
    const total = items.reduce((sum, it) => sum + it.amount, 0);
    const share = total / people.length;

    const split = people.map((p) => ({
      ...p,
      total: share,
      items: items
    }));
    onSplit(split);
  };

  return (
    <div className="p-4 mt-4 border rounded-lg bg-white">
      <h2 className="font-bold mb-2">Add People</h2>
      <div className="flex gap-2 mb-3">
        <input
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          placeholder="Person name"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={addPerson}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Add
        </button>
      </div>

      <ul className="mb-4">
        {people.map((p, i) => (
          <li key={i} className="py-1">
            {p.name}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          onClick={splitEvenly}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Split Evenly
        </button>
        <button
          onClick={goBack}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
