import React, { useState } from 'react';
import './Splash.css';
import logo from './img/sgmsft.png';

function Splash({ onStart }) {
  const [isLeftHanded, setIsLeftHanded] = useState(false);

  const handleStart = () => {
    onStart({ isLeftHanded });
  };

  return (
    <div className="splash-container">
      <img src={logo} alt="SGM's Fretboard Trainer" className="logo" />
      <div className="options-container">
        <div className="option">
          <button 
            className={`mode-toggle ${isLeftHanded ? 'active' : ''}`}
            onClick={() => setIsLeftHanded(!isLeftHanded)}
          >
            {isLeftHanded ? 'Lefties Mode' : 'Righties Mode'}
          </button>
        </div>
        <button className="start-button" onClick={handleStart}>
          BEGIN!
        </button>
      </div>
    </div>
  );
}

export default Splash; 