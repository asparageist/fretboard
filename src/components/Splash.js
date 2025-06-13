import React, { useState, useRef, useEffect } from 'react';
import './Splash.css';
import logo from './img/sgmsft.png';

function Splash({ onStart }) {
  const [isLeftHanded, setIsLeftHanded] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // 'find' or 'identify' or null
  const findBtnRef = useRef(null);
  const identifyBtnRef = useRef(null);
  const toneBtnRef = useRef(null);

  useEffect(() => {
    if (!activeButton) return;
    function handleClickOutside(e) {
      let btnRef = null;
      if (activeButton === 'find') btnRef = findBtnRef;
      else if (activeButton === 'identify') btnRef = identifyBtnRef;
      else if (activeButton === 'tone') btnRef = toneBtnRef;
      if (btnRef && btnRef.current && !btnRef.current.contains(e.target)) {
        setActiveButton(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeButton]);

  const handleButtonClick = (mode) => {
    if (activeButton === mode) {
      onStart({ isLeftHanded, mode });
    } else {
      setActiveButton(mode);
    }
  };

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img src={logo} alt="SGM's Fretboard Trainer" className="logo" />
        <div className="options-container">
          <div className="option">
            <button 
              className={`hand-mode ${isLeftHanded ? 'active' : ''}`}
              onClick={() => setIsLeftHanded(!isLeftHanded)}
            >
              {isLeftHanded ? 'Lefties Mode' : 'Righties Mode'}
            </button>
          </div>
          <div className="button-container">
            {activeButton === 'tone' && (
              <span className="begin-prompt">BEGIN</span>
            )}
            <button
              ref={toneBtnRef}
              className={`mode-button${activeButton === 'tone' ? ' active' : ''}`}
              onClick={() => handleButtonClick('tone')}
            >
              <span className="button-label">Adjust Tone</span>
              <div className="modeInfo">
                <p>{activeButton === 'tone' ? 'Adjust the tone of the oscillator synth' : ''}</p>
              </div>
            </button>
          </div>
          <div className="button-container">
            {activeButton === 'find' && (
              <span className="begin-prompt">BEGIN</span>
            )}
            <button 
              ref={findBtnRef}
              className={`mode-button${activeButton === 'find' ? ' active' : ''}`}
              onClick={() => handleButtonClick('find')}
            >
              <span className="button-label">Find Notes</span>
              <div className="modeInfo">
                <p>{activeButton === 'find' ? 'Find the designated notes on the fretboard' : ''}</p>
              </div>
            </button>
          </div>
          <div className="button-container">
            
            {activeButton === 'identify' && (
              <span className="begin-prompt">BEGIN</span>
            )}
            <button 
              ref={identifyBtnRef}
              className={`mode-button${activeButton === 'identify' ? ' active' : ''}`}
              onClick={() => handleButtonClick('identify')}
            >
              <span className="button-label">Identify Notes</span>
              <div className="modeInfo">
                <p>{activeButton === 'identify' ? 'Identify the note on the designated fret' : ''}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
{/* <FretTone onApply={handleFretToneApply} /> */}
//use above for the synth settings page

export default Splash; 