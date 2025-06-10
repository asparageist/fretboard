import React from 'react';
import './Fretboard.css';

const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
const numFrets = 13;
const dotFrets = [2, 4, 6, 8, 11]; // 3, 5, 7, 9, 12 (zero-based)

const initialFretWidth = 70; // px
const ratio = 0.95;
const fretWidths = Array.from({ length: numFrets }, (_, i) => initialFretWidth * Math.pow(ratio, i));

const Fretboard = () => {
  const handleFretClick = (stringIndex, fretIndex) => {
    console.log(`Clicked string ${strings[stringIndex]} at fret ${fretIndex}`);
  };

  // For dot vertical position
  const stringHeight = 40; // px, must match CSS
  const dotY = (3 * stringHeight + 4); // halfway between D and G and 4 for some reason

  // Calculate left positions for dots based on fret widths
  const fretLefts = fretWidths.reduce((acc, width, i) => {
    acc.push((acc[i - 1] || 49) + (i > 0 ? fretWidths[i - 1] : 0));
    return acc;
  }, []);

  return (
    <div className="fretboard-container">
      <div className="fretboard fretboard-with-dots">
        {/* Fret dots as absolutely positioned overlays */}
        {dotFrets.map((fretIndex) => {
          // Calculate left position: sum of previous fret widths + half current fret width
          const left = fretLefts[fretIndex] + fretWidths[fretIndex] / 2 - 7; // 7 is half dot width
          if (fretIndex === 11) {
            // Double dot for 12th fret
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
            <div className="string-label">{string}</div>
            <div className="string">
              {Array.from({ length: numFrets }).map((_, fretIndex) => (
                <button
                  key={`${string}-${fretIndex}`}
                  className="fret"
                  style={{ width: `${fretWidths[fretIndex]}px` }}
                  onClick={() => handleFretClick(stringIndex, fretIndex)}
                >
                  {/* etc */}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fretboard; 