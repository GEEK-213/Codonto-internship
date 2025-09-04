import { useState } from "react";

export default function PeopleSplitter({ items }) {
  const [numPeople, setNumPeople] = useState(2);

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const perPerson = numPeople > 0 ? (total / numPeople).toFixed(2) : 0;

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
      <h3>Split Between People</h3>
      <label>
        Number of People:{" "}
        <input
          type="number"
          min="1"
          value={numPeople}
          onChange={(e) => setNumPeople(Number(e.target.value))}
        />
      </label>
      <p>Total Bill: ₹{total.toFixed(2)}</p>
      <p>Each Person Pays: ₹{perPerson}</p>
    </div>
  );
}
