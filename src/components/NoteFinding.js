import React, { useState, useEffect } from 'react';
import Fretboard from './Fretboard';
import './NoteFinding.css';
import { FretTone } from './FretTone';

const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NoteFinding = ({ isLeftHanded, synthSettings, onBack }) => {
  const [targetNote, setTargetNote] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [message, setMessage] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [localSynthSettings, setLocalSynthSettings] = useState(synthSettings || { oscType: 'sawtooth', envelope: { attack: 0.005, decay: 0.5, sustain: 0.5, release: 1 } });

  const generateRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * chromatic.length);
    return chromatic[randomIndex];
  };

  useEffect(() => {
    setTargetNote(generateRandomNote());
  }, []);

  useEffect(() => {
    let interval;
    if (isCorrect) {
      interval = setInterval(() => setShowNext(prev => !prev), 900);
    } else {
      setShowNext(false);
    }
    return () => clearInterval(interval);
  }, [isCorrect]);

  const handleFretClick = (noteWithOctave) => {
    const playedNote = noteWithOctave.replace(/[0-9]/g, '');
    if (playedNote === targetNote) {
      setIsCorrect(true);
      setMessage('YES');
    } else {
      setIsCorrect(false);
      setMessage('NO');
    }
  };

  const handleNextNote = () => {
    setTargetNote(generateRandomNote());
    setIsCorrect(null);
    setMessage('');
  };

  const handleTargetNoteClick = () => {
    if (isCorrect) {
      handleNextNote();
    }
  };

  const handleOscTypeChange = (oscType) => {
    setLocalSynthSettings(prev => ({ ...prev, oscType }));
  };

  const handleEnvelopeChange = (envelope) => {
    setLocalSynthSettings(prev => ({ ...prev, envelope }));
  };

  return (
    <div className="note-finding-container">
      <button
        className="back-to-splash-btn"
        onClick={() => onBack && onBack(localSynthSettings)}
        style={{
          alignSelf: 'flex-start',
          margin: '2vmin',
          padding: '1vmin 2vmin',
          fontSize: '2vmin',
          background: '#444',
          color: '#eee',
          border: 'none',
          borderRadius: '0.5vmin',
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0004',
        }}
      >
        BACK
      </button>
      <div
        className="target-note"
        onClick={handleTargetNoteClick}
        style={{ cursor: isCorrect ? 'pointer' : 'default' }}
      >
        <div className={`note-display ${isCorrect ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
          {message && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? (showNext ? 'NEXT' : 'YES') : message}
            </div>
          )}
          <span>{targetNote}</span>
        </div>
      </div>
      <Fretboard
        onFretClick={handleFretClick}
        isLeftHanded={isLeftHanded}
        synthSettings={localSynthSettings}
        onOscTypeChange={handleOscTypeChange}
        onEnvelopeChange={handleEnvelopeChange}
      />
    </div>
  );
};

export default NoteFinding; 