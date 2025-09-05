export default function FinalSummary({ people, items, splitEvenly, onBack, onReset }) {
  let summary = {};

  if (splitEvenly) {
    const total = items.reduce((sum, it) => sum + it.price, 0);
    const perPerson = people.length > 0 ? total / people.length : 0;
    people.forEach((p) => {
      summary[p] = perPerson;
    });
  } else {
    people.forEach((p) => (summary[p] = 0));
    items.forEach((it) => {
      if (it.person) summary[it.person] += it.price;
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Final Summary</h2>
      <ul className="space-y-2 mb-6">
        {people.map((p, i) => (
          <li
            key={i}
            className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg"
          >
            <span>{p}</span>
            <span>₹{summary[p].toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        >
          Go Back
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
