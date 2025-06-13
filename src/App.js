import React, { useState } from 'react';
import './App.css';
import Splash from './components/Splash';
import NoteFinding from './components/NoteFinding';

function App() {
  const [showFretboard, setShowFretboard] = useState(false);
  const [options, setOptions] = useState({ isLeftHanded: false, mode: 'find' });

  const handleStart = (selectedOptions) => {
    setOptions(selectedOptions);
    setShowFretboard(true);
  };

  return (
    <div className="App">
      <main>
        {!showFretboard ? (
          <Splash onStart={handleStart} />
        ) : options.mode === 'find' ? (
          <NoteFinding isLeftHanded={options.isLeftHanded} />
        ) : (
          <div className="coming-soon">Identify Notes Component (Coming Soon)</div>
        )}
      </main>
    </div>
  );
}

export default App;
