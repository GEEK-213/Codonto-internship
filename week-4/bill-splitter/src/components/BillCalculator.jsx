import React, { useState } from "react";

function BillCalculator({ items }) {
  const [people, setPeople] = useState(1);

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const perPerson = people > 0 ? (total / people).toFixed(2) : 0;

  return (
    <div className="bg-gray-100 p-3 rounded-lg">
      <label className="block font-semibold mb-1">👥 Number of People</label>
      <input
        type="number"
        min="1"
        value={people}
        onChange={(e) => setPeople(parseInt(e.target.value))}
        className="border rounded p-2 w-20 mb-3"
      />

      <p className="font-semibold">Total: ₹{total.toFixed(2)}</p>
      <p className="font-semibold">Per Person: ₹{perPerson}</p>
    </div>
  );
}

export default BillCalculator;
