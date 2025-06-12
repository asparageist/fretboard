import React, { useState } from 'react';
import './App.css';
import Fretboard from './components/Fretboard';
import Splash from './components/Splash';

function App() {
  const [showFretboard, setShowFretboard] = useState(false);
  const [options, setOptions] = useState({ isLeftHanded: false });

  const handleStart = (selectedOptions) => {
    setOptions(selectedOptions);
    setShowFretboard(true);
  };

  return (
    <div className="App">
      <main>
        {!showFretboard ? (
          <Splash onStart={handleStart} />
        ) : (
          <Fretboard isLeftHanded={options.isLeftHanded} />
        )}
      </main>
    </div>
  );
}

export default App;
