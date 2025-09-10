import React from 'react';

const LandingScreen = ({ onScan }) => {
  return (
    <div className="text-center">
      <h1>Bill Splitter</h1>
      <p>Upload a receipt and split the bill with ease.</p>
      <button onClick={onScan} className="btn">
        Scan a Receipt
      </button>
    </div>
  );
};

export default LandingScreen;