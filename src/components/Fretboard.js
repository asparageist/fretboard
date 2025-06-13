import React, { useState, useEffect } from 'react';
import './Fretboard.css';
import useFretTone from './FretTone';

const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
const openNotes = ['E', 'A', 'D', 'G', 'B', 'E'];
const stringTunings = [
  { note: 'E', octave: 2 },
  { note: 'A', octave: 2 },
  { note: 'D', octave: 3 },
  { note: 'G', octave: 3 },
  { note: 'B', octave: 3 },
  { note: 'E', octave: 4 },
];
const numFrets = 14;
const dotFrets = [3, 5, 7, 9, 12];

const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const initialFretWidth = 15; // vmin
const ratio = 0.95;
const fretWidths = Array.from({ length: numFrets }, (_, i) => initialFretWidth * Math.pow(ratio, i));

function getNoteWithOctave(openNote, openOctave, fret) {
  let noteIndex = chromatic.indexOf(openNote);
  let octave = openOctave;
  let currentIndex = noteIndex;
  for (let i = 0; i < fret; i++) {
    currentIndex++;
    if (currentIndex === 12) {
      currentIndex = 0;
      octave++;
    }
  }
  return chromatic[currentIndex] + octave;
}

const Fretboard = ({ isLeftHanded: initialLeftHanded = false, onFretClick }) => {
  const [leftHanded] = useState(initialLeftHanded);
  const { playNote } = useFretTone();

  // Mirror fret number for left-handed mode
  const handleFretClick = (stringIndex, logicalFret) => {
    const { note, octave } = stringTunings[stringIndex];
    const noteWithOctave = getNoteWithOctave(note, octave, logicalFret);
    console.log(`String ${strings[stringIndex]}, Fret ${logicalFret}: ${noteWithOctave}`);
    
    // Play the note
    playNote(noteWithOctave);
    
    // Call the parent's onFretClick if provided
    if (onFretClick) {
      onFretClick(noteWithOctave);
    }
  };

  // For left-handed
  const displayFretWidths = leftHanded ? [...fretWidths].reverse() : fretWidths;

  // Calculate dots from left
  const getFretLefts = (widths, leftPad = 1) => // adjust them dots
    widths.reduce((acc, width, i) => {
      acc.push((acc[i - 1] || leftPad) + (i > 0 ? widths[i - 1] : 0));
      return acc;
    }, []);
  const displayFretLefts = getFretLefts(displayFretWidths);

  // For dot vertical position
  const stringHeight = 6; // vmin (was 40px)
  const dotY = (3 * stringHeight + 0.6); // vmin

  // Adjust dots for left-handed mode
  const displayDotFrets = leftHanded
    ? dotFrets.map(f => numFrets - 1 - f)
    : dotFrets;

  // Determine which fret should have double dots
  const doubleDotFret = leftHanded ? numFrets - 1 - 12 : 12;

  return (
    <div className="fretboard-container">
      <div className="fretboard-content">
        <div className="fretboard fretboard-with-dots">
          <div
            className="nut"
            style={
              leftHanded
              ? { left: 'auto', right: (displayFretWidths[displayFretWidths.length - 1] + 0.2) + 'vmin' }
              : { left: displayFretWidths[0] + 'vmin', right: 'auto' }
            }
          />
          {displayDotFrets.map((fretIndex) => {
            const fretPosition = displayFretLefts[fretIndex];
            const fretWidth = displayFretWidths[fretIndex];
            const left = fretPosition + (fretWidth / 2) - 0.7;

            if (fretIndex === doubleDotFret) {
              return (
                <React.Fragment key={fretIndex}>
                  <div
                    className="fret-dot absolute-dot"
                    style={{ left: `${left}vmin`, top: `${dotY - 6}vmin` }}
                  />
                  <div
                    className="fret-dot absolute-dot"
                    style={{ left: `${left}vmin`, top: `${dotY + 6}vmin` }}
                  />
                </React.Fragment>
              );
            }
            return (
              <div
                key={fretIndex}
                className="fret-dot absolute-dot"
                style={{ left: `${left}vmin`, top: `${dotY}vmin` }}
              />
            );
          })}
          {strings.map((string, stringIndex) => (
            <div key={string} className="string-row">
              <div className="string">
                {displayFretWidths.map((width, fretIndex) => {
                  const logicalFret = leftHanded ? numFrets - 1 - fretIndex : fretIndex;
                  return (
                    <button
                      key={`${string}-${fretIndex}`}
                      className={`fret${logicalFret === 0 ? ' open-string' : ''}`}
                      style={{ width: `${width}vmin` }}
                      onClick={() => handleFretClick(stringIndex, logicalFret)}
                    >
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fretboard; 