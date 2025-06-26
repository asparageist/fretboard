import React, { useState } from 'react';
import './App.css';
import Splash from './components/Splash';
import NoteFinding from './components/NoteFinding';
import FretTone from './components/FretTone';

function App() {
  const [showMain, setShowMain] = useState(false);
  const [options, setOptions] = useState({ isLeftHanded: false, mode: 'find' });
  const [synthSettings, setSynthSettings] = useState({ oscType: 'sawtooth', envelope: { attack: 0.005, decay: 0.5, sustain: 0.5, release: 1 } });

  const handleStart = (selectedOptions) => {
    setOptions(selectedOptions);
    setShowMain(true);
  };

  const handleApplySynthSettings = (settings) => {
    setSynthSettings(settings);
  };

  return (
    <div className="App">
      <main>
        {!showMain ? (
          <Splash onStart={handleStart} />
        ) : options.mode === 'find' ? (
          <NoteFinding isLeftHanded={options.isLeftHanded} synthSettings={synthSettings} />
        ) : options.mode === 'tone' ? (
          <FretTone onBack={() => setShowMain(false)} synthSettings={synthSettings} onApplySynthSettings={handleApplySynthSettings} isLeftHanded={options.isLeftHanded} />
        ) : (
          <div className="coming-soon">Identify Notes Component (Coming Soon)</div>
        )}
      </main>
    </div>
  );
}

export default App;
