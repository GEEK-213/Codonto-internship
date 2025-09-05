import { useState } from "react";

export default function BillSplitter({
  people,
  setPeople,
  items,
  setItems,
  splitEvenly,
  setSplitEvenly,
  onFinish,
}) {
  const [personName, setPersonName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [assignedPerson, setAssignedPerson] = useState("");

  const addPerson = () => {
    if (!personName.trim()) return;
    setPeople([...people, personName.trim()]);
    setPersonName("");
  };

  const addItem = () => {
    if (!itemName.trim() || !itemPrice) return;
    setItems([
      ...items,
      { name: itemName.trim(), price: parseFloat(itemPrice), person: assignedPerson || null },
    ]);
    setItemName("");
    setItemPrice("");
    setAssignedPerson("");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add People & Items</h2>

      {/* People */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">People</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Person name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={addPerson}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add
          </button>
        </div>
        <ul className="flex gap-2 flex-wrap">
          {people.map((p, i) => (
            <li key={i} className="bg-gray-200 px-3 py-1 rounded-full">
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
          <input
            type="text"
            placeholder="Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={assignedPerson}
            onChange={(e) => setAssignedPerson(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Unassigned</option>
            {people.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
        <ul>
          {items.map((it, i) => (
            <li key={i} className="flex justify-between border-b py-1">
              <span>{it.name} — ₹{it.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">
                {it.person || "Unassigned"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Options */}
      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={splitEvenly}
            onChange={(e) => setSplitEvenly(e.target.checked)}
          />
          Split Evenly
        </label>
      </div>

      {/* Next */}
      <button
        onClick={onFinish}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
      >
        Split Bill
      </button>
    </div>
  );
}
