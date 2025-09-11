import React from 'react';

const LandingScreen = ({ onScan, onEnterManually }) => {
  return (
    <div className="card-design text-center">
      <h1 className="app-title">Bill-Splitter.</h1>
      <p className="app-subtitle">Scan - Split - Pay </p>
      
 
      <button onClick={onScan} className="btn-design-primary">
        Scan Receipt
      </button>

      
      <button onClick={onEnterManually} className="btn-design-secondary">
        Enter Bill Manually
      </button>
    </div>
  );
};

export default LandingScreen;