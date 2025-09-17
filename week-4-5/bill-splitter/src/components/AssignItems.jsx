import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/helpers.js';

const AssignItems = ({ billDetails, onProceed, onBack }) => {
  const { items, tax, tip } = billDetails;
  const [people, setPeople] = useState([]);
  const [personName, setPersonName] = useState('');
  const [assignments, setAssignments] = useState({});
  const [splitMode, setSplitMode] = useState('manually');

  useEffect(() => {
    const initialAssignments = {};
    items.forEach(item => { initialAssignments[item.id] = []; });
    setAssignments(initialAssignments);
  }, [items]);

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (personName.trim() && !people.some(p => p.name === personName.trim())) {
      const newPerson = { id: crypto.randomUUID(), name: personName.trim() };
      setPeople([...people, newPerson]);
      setPersonName('');
    }
  };
  
  const handleDeletePerson = (personId) => {
      setPeople(people.filter(p => p.id !== personId));
      const newAssignments = { ...assignments };
      for (const itemId in newAssignments) {
        newAssignments[itemId] = newAssignments[itemId].filter(pId => pId !== personId);
      }
      setAssignments(newAssignments);
  };

  const handleAssignmentChange = (itemId, personId) => {
    const currentAssignments = assignments[itemId] || [];
    const isAssigned = currentAssignments.includes(personId);
    const newAssignments = isAssigned
      ? currentAssignments.filter(id => id !== personId)
      : [...currentAssignments, personId];
    setAssignments({ ...assignments, [itemId]: newAssignments });
  };

  const handleContinue = () => {
    const billSubtotal = items.reduce((sum, item) => sum + item.price, 0);
    const totalTaxAndTip = tax + tip;
    const billTotal = billSubtotal + totalTaxAndTip;
    let finalTotals = [];

    if (splitMode === 'evenly') {
      const perPersonAmount = people.length > 0 ? billTotal / people.length : 0;
      finalTotals = people.map(p => ({ name: p.name, amount: perPersonAmount }));
    } else {
      const personSubtotals = people.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {});
      let unassignedTotal = 0;
      items.forEach(item => {
        const assignedPeople = assignments[item.id];
        if (assignedPeople && assignedPeople.length > 0) {
          const share = item.price / assignedPeople.length;
          assignedPeople.forEach(personId => { personSubtotals[personId] += share; });
        } else {
          unassignedTotal += item.price;
        }
      });
      
      const unassignedShare = people.length > 0 ? unassignedTotal / people.length : 0;
      people.forEach(p => { personSubtotals[p.id] += unassignedShare; });

      finalTotals = people.map(p => {
        const personSubtotal = personSubtotals[p.id] || 0;
        const proportion = billSubtotal > 0 ? personSubtotal / billSubtotal : (1 / (people.length || 1));
        const personTotal = personSubtotal + (proportion * totalTaxAndTip);
        return { name: p.name, amount: personTotal };
      });
    }
    onProceed({ individualTotals: finalTotals, billTotal });
  };

  return (
    <div className="card-design">
      <button onClick={onBack} className="back-button">&larr; Back</button>
      <h2 className="header-title">Who Paid for What?</h2>
      
      <form onSubmit={handleAddPerson} className="add-person-form-design">
        <button type="submit">+ Add Person</button>
        <input type="text" placeholder="Enter a name" value={personName} onChange={(e) => setPersonName(e.target.value)}/>
      </form>
       <div className="people-list-design">
        {people.map(p => (
          <div key={p.id} className="person-tag-design">
            {p.name}
            <button onClick={() => handleDeletePerson(p.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="assign-header">
        <h3>Assign Items</h3>
        <button onClick={() => setSplitMode(splitMode === 'evenly' ? 'manually' : 'evenly')} className="split-mode-button">
            {splitMode === 'evenly' ? 'Split by Item' : 'Split Evenly'}
        </button>
      </div>

      <div className="item-list-design assign-list">
        {items.map(item => (
          <div key={item.id} className="assign-item-row">
            <div className="assign-item-info">
              <span>{item.name || 'New Item'}</span>
              <span>{formatCurrency(item.price)}</span>
            </div>
            {splitMode === 'manually' && (
                <div className="assign-person-pills">
                {people.map(person => {
                    const isAssigned = assignments[item.id]?.includes(person.id);
                    return (
                    <button key={person.id} onClick={() => handleAssignmentChange(item.id, person.id)} className={`person-pill ${isAssigned ? 'assigned' : ''}`}>
                        {person.name}
                    </button>
                    );
                })}
                </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleContinue} className="btn-design-primary" disabled={people.length === 0}>
        Continue
      </button>
      
    </div>
  );
};

export default AssignItems;