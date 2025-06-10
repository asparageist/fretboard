import React, { useState } from 'react';
import './Fretboard.css';

const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
const openNotes = ['E', 'A', 'D', 'G', 'B', 'E']; // high e is also E
const numFrets = 14;
const dotFrets = [3, 5, 7, 9, 12]; // 3, 5, 7, 9, 12 (zero-based)

const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Calculate fret widths using geometric progression
const initialFretWidth = 90; // px
const ratio = 0.95;
const fretWidths = Array.from({ length: numFrets }, (_, i) => initialFretWidth * Math.pow(ratio, i));

const Fretboard = () => {
  const [leftHanded, setLeftHanded] = useState(false);

  const handleFretClick = (stringIndex, logicalFret) => {
    const openNote = openNotes[stringIndex];
    const openIndex = chromatic.indexOf(openNote);
    const note = chromatic[(openIndex + logicalFret) % 12];
    console.log(`String ${strings[stringIndex]}, Fret ${logicalFret}: ${note}`);
  };

  // For left-handed, reverse the fret widths so the widest is on the right
  const displayFretWidths = leftHanded ? [...fretWidths].reverse() : fretWidths;

  // Calculate left positions for dots based on displayFretWidths
  const getFretLefts = (widths, leftPad = 9) =>
    widths.reduce((acc, width, i) => {
      acc.push((acc[i - 1] || leftPad) + (i > 0 ? widths[i - 1] : 0));
      return acc;
    }, []);
  const displayFretLefts = getFretLefts(displayFretWidths);

  // For dot vertical position
  const stringHeight = 40; // px, must match CSS
  const dotY = (3 * stringHeight + 4); // halfway between D and G and +4 for some reason

  // Adjust dot frets for left-handed mode
  const displayDotFrets = leftHanded
    ? dotFrets.map(f => numFrets - 1 - f)
    : dotFrets;

  // Determine which fret should have double dots
  const doubleDotFret = leftHanded ? numFrets - 1 - 12 : 12;

  return (
    <div className="fretboard-container">
      <div className="fretboard fretboard-with-dots">
        <div
          className="nut"
          style={
            leftHanded
            ? { left: 'auto', right: (displayFretWidths[displayFretWidths.length - 1] + 2) + 'px' } // +2 adjusts pixel position
            : { left: displayFretWidths[0] + 'px', right: 'auto' }
          }
        />
        {/* Fret dots as absolutely positioned overlays */}
        {displayDotFrets.map((fretIndex) => {
          const left = displayFretLefts[fretIndex] + displayFretWidths[fretIndex] / 2 - 7;
          if (fretIndex === doubleDotFret) {
            // Double dot for 12th fret (index 11 in right-handed, 2 in left-handed)
            return (
              <React.Fragment key={fretIndex}>
                <div
                  className="fret-dot absolute-dot"
                  style={{ left: `${left}px`, top: `${dotY - 40}px` }}
                />
                <div
                  className="fret-dot absolute-dot"
                  style={{ left: `${left}px`, top: `${dotY + 40}px` }}
                />
              </React.Fragment>
            );
          }
          // Single dot
          return (
            <div
              key={fretIndex}
              className="fret-dot absolute-dot"
              style={{ left: `${left}px`, top: `${dotY}px` }}
            />
          );
        })}
        {/* Strings and frets */}
        {strings.map((string, stringIndex) => (
          <div key={string} className="string-row">
            {/* <div className="string-label">{string}</div> */}
            <div className="string">
              {displayFretWidths.map((width, fretIndex) => {
                const logicalFret = leftHanded ? numFrets - 1 - fretIndex : fretIndex;
                return (
                  <button
                    key={`${string}-${fretIndex}`}
                    className={`fret${logicalFret === 0 ? ' open-string' : ''}`}
                    style={{ width: `${width}px` }}
                    onClick={() => handleFretClick(stringIndex, logicalFret)}
                  >
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '24px', color: '#e0e0e0', textAlign: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={leftHanded}
            onChange={e => setLeftHanded(e.target.checked)}
          />
          {' '}Left hand
        </label>
      </div>
    </div>
  );
};

export default Fretboard; 