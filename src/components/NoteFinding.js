import React, { useState, useEffect } from 'react';
import Fretboard from './Fretboard';
import './NoteFinding.css';

const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NoteFinding = ({ isLeftHanded }) => {
  const [targetNote, setTargetNote] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [message, setMessage] = useState('');

  // Generate a random note
  const generateRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * chromatic.length);
    return chromatic[randomIndex];
  };

  // Initialize with a random note
  useEffect(() => {
    setTargetNote(generateRandomNote());
  }, []);

  // Handle fret click
  const handleFretClick = (noteWithOctave) => {
    // Extract the note without octave (e.g., 'C4' -> 'C')
    const playedNote = noteWithOctave.replace(/[0-9]/g, '');
    
    if (playedNote === targetNote) {
      setIsCorrect(true);
      setMessage('Correct!');
      // Generate new note after a short delay
      setTimeout(() => {
        setTargetNote(generateRandomNote());
        setIsCorrect(null);
        setMessage('');
      }, 1500);
    } else {
      setIsCorrect(false);
      setMessage('Try again!');
      // Clear message after a short delay
      setTimeout(() => {
        setIsCorrect(null);
        setMessage('');
      }, 1500);
    }
  };

  return (
    <div className="note-finding-container">
      <div className="target-note">
        <div className={`note-display ${isCorrect ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
          {targetNote}
        </div>
        {message && <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>{message}</div>}
      </div>
      <Fretboard onFretClick={handleFretClick} isLeftHanded={isLeftHanded} />
    </div>
  );
};

export default NoteFinding; 