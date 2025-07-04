import React, { useState, useEffect, useRef } from 'react';
import './Fretboard.css';
import { useFretTone } from './FretTone';

const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
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

const Fretboard = ({ isLeftHanded: initialLeftHanded = false, onFretClick, synthSettings, onOscTypeChange, onEnvelopeChange }) => {
  const [leftHanded] = useState(initialLeftHanded);
  const { playNote } = useFretTone(synthSettings);
  const [oscDropdownOpen, setOscDropdownOpen] = useState(false);
  const [oscType, setOscType] = useState(synthSettings?.oscType || 'sawtooth');
  const [envPopover, setEnvPopover] = useState(null); // 'attack', 'decay', 'sustain', 'release' or null
  const [envFadeOut, setEnvFadeOut] = useState(false);
  const fadeTimeoutRef = useRef();
  const [envelope, setEnvelope] = useState(synthSettings?.envelope || { attack: 0.005, decay: 0.5, sustain: 0.5, release: 1 });

  useEffect(() => {
    setEnvelope(synthSettings?.envelope || { attack: 0.005, decay: 0.5, sustain: 0.5, release: 1 });
  }, [synthSettings]);

  const handleFretClick = (stringIndex, logicalFret) => {
    const { note, octave } = stringTunings[stringIndex];
    const noteWithOctave = getNoteWithOctave(note, octave, logicalFret);
    playNote(noteWithOctave);
    if (onFretClick) {
      onFretClick(noteWithOctave);
    }
  };

  const displayFretWidths = leftHanded ? [...fretWidths].reverse() : fretWidths;

  const getFretLefts = (widths, leftPad = 1) =>
    widths.reduce((acc, width, i) => {
      acc.push((acc[i - 1] || leftPad) + (i > 0 ? widths[i - 1] : 0));
      return acc;
    }, []);
  const displayFretLefts = getFretLefts(displayFretWidths);

  const stringHeight = 6; // vmin
  const dotY = (3 * stringHeight + 0.6); // vmin

  const displayDotFrets = leftHanded
    ? dotFrets.map(f => numFrets - 1 - f)
    : dotFrets;

  const doubleDotFret = leftHanded ? numFrets - 1 - 12 : 12;

  const handleOscTypeSelect = (type) => {
    setOscType(type);
    setOscDropdownOpen(false);
    if (onOscTypeChange) onOscTypeChange(type);
  };

  const handleEnvChange = (param, value) => {
    const newEnv = { ...envelope, [param]: parseFloat(value) };
    setEnvelope(newEnv);
    if (onEnvelopeChange) onEnvelopeChange(newEnv);
  };

  const handleEnvSliderRelease = () => {
    setEnvFadeOut(true);
    fadeTimeoutRef.current = setTimeout(() => {
      setEnvPopover(null);
      setEnvFadeOut(false);
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(fadeTimeoutRef.current);
  }, []);

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
        <div className="fretboard-labels-container">
          <div className="fretboard-label-oscillator" style={{ position: 'relative' }}>
            <button className="fretboard-label osc-btn" onClick={() => setOscDropdownOpen(v => !v)}>
              Oscillator
            </button>
            {oscDropdownOpen && (
              <div className="osc-dropdown">
                {['sine','square','sawtooth','triangle'].map(type => (
                  <div key={type} className="osc-dropdown-item" onClick={() => handleOscTypeSelect(type)}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
          {['attack','decay','sustain','release'].map(param => (
            <div key={param} className="fretboard-label-env" style={{ position: 'relative' }}>
              <button className="fretboard-label env-btn" onClick={() => setEnvPopover(envPopover === param ? null : param)}>
                {param.charAt(0).toUpperCase() + param.slice(1)}
              </button>
              {envPopover === param && (
                <div className={`env-popover${envFadeOut ? ' fade-out' : ''}`}>
                  <input
                    type="range"
                    min={param === 'sustain' ? 0 : 0.001}
                    max={param === 'attack' ? 0.5 : param === 'decay' ? 2 : param === 'release' ? 3 : 1}
                    step={param === 'attack' ? 0.001 : 0.01}
                    value={envelope[param]}
                    onChange={e => handleEnvChange(param, e.target.value)}
                    onMouseUp={handleEnvSliderRelease}
                    onTouchEnd={handleEnvSliderRelease}
                  />
                  <span className="env-value">{envelope[param]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fretboard; 