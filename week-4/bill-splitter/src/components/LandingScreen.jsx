import React from 'react';

const LandingScreen = ({ onScan }) => {
  return (
    <div className="card-design text-center">
      <h1 className="app-title">Scan. Tap. Split.</h1>
      <p className="app-subtitle">Snap the receipt</p>
      <button onClick={onScan} className="btn-design-primary">
        Scan Receipt
      </button>
    </div>
  );
};

export default LandingScreen;