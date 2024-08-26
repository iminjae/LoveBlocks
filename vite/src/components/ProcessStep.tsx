import React from 'react';

const ProcessStep = ({ stepNumber, title, description, icon }) => {
  return (
    <div className="relative flex flex-col items-center text-center p-4">
      <div className="w-32 h-12 bg-blue-500 text-white flex items-center justify-center rounded-t-lg">
        <span className="font-bold">STEP {stepNumber}</span>
      </div>
      <div className="w-32 h-32 bg-white border-4 border-blue-500 rounded-b-lg flex flex-col items-center justify-center shadow-lg">
        <div className="mb-2 text-xl">{icon}</div>
        <div className="font-bold text-blue-500">{title}</div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 left-full w-8 h-8 bg-white border-4 border-blue-500 rounded-full"></div>
    </div>
  );
};

export default ProcessStep;
