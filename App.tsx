import React from 'react';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-white/80 tracking-wider hidden sm:block">
          SimpleCalc
        </h1>
        <Calculator />
        <p className="text-white/30 text-xs mt-4">
          Сделано с React & Tailwind
        </p>
      </div>
    </div>
  );
};

export default App;