import React, { useState, useEffect } from 'react';
import Fretboard from './Fretboard';
import './NoteFinding.css';
import { FretTone } from './FretTone';

const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NoteFinding = ({ isLeftHanded, synthSettings }) => {
  const [targetNote, setTargetNote] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [message, setMessage] = useState('');
  const [showNext, setShowNext] = useState(false);

  // Generate a random note
  const generateRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * chromatic.length);
    return chromatic[randomIndex];
  };

  // Initialize with a random note
  useEffect(() => {
    setTargetNote(generateRandomNote());
  }, []);

  // Alternate YES/NEXT text when correct
  useEffect(() => {
    let interval;
    if (isCorrect) {
      interval = setInterval(() => setShowNext(prev => !prev), 900);
    } else {
      setShowNext(false);
    }
    return () => clearInterval(interval);
  }, [isCorrect]);

  // Handle fret click
  const handleFretClick = (noteWithOctave) => {
    // Extract the note without octave (e.g., 'C4' -> 'C')
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

  return (
    <div className="note-finding-container">
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
      <Fretboard onFretClick={handleFretClick} isLeftHanded={isLeftHanded} synthSettings={synthSettings} />
    </div>
  );
};

export default NoteFinding; 