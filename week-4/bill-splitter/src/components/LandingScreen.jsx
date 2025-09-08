import React from 'react';

const LandingScreen = ({ onStart }) => (
  <div className="text-center">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">AI Bill Splitter</h1>
    <p className="text-lg text-gray-600 mb-8">Scan a receipt, categorize items with AI, and split the bill.</p>
    <button
      onClick={onStart}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      Scan a Receipt
    </button>
  </div>
);

export default LandingScreen;

