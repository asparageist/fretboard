import React, { useState } from 'react';
import './App.css';
import Splash from './components/Splash';
import NoteFinding from './components/NoteFinding';

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
          <NoteFinding isLeftHanded={options.isLeftHanded} />
        )}
      </main>
    </div>
  );
}

export default App;
