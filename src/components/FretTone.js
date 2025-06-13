import React, { useEffect, useCallback, useState, useRef } from 'react';
import * as Tone from 'tone';

// Custom hook for audio functionality
const useFretTone = (synthSettings) => {
  const synthRef = React.useRef();
  const reverbRef = React.useRef();

  useEffect(() => {
    // Clean up previous synth/reverb
    if (synthRef.current) synthRef.current.dispose();
    if (reverbRef.current) reverbRef.current.dispose();
    // Create new synth and reverb with current settings
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: synthSettings?.oscType || 'sawtooth',
      },
      envelope: synthSettings?.envelope || {
        attack: 0.005,
        decay: 0.5,
        sustain: 0.5,
        release: 1,
      },
      filter: {
        type: 'lowpass',
        frequency: 2000,
        rolloff: -12,
        Q: 1
      }
    }).toDestination();
    reverbRef.current = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
    synthRef.current.connect(reverbRef.current);
    return () => {
      if (synthRef.current) synthRef.current.dispose();
      if (reverbRef.current) reverbRef.current.dispose();
    };
  }, [synthSettings]);

  // Initialize Tone.js
  useEffect(() => {
    const startAudio = async () => {
      await Tone.start();
      console.log('Audio context started');
    };
    document.addEventListener('click', startAudio, { once: true });
    return () => document.removeEventListener('click', startAudio);
  }, []);

  // Function to play a note
  const playNote = useCallback((note, duration = '8n') => {
    if (Tone.context.state !== 'running') {
      console.log('Audio context not started');
      return;
    }
    try {
      if (synthRef.current) synthRef.current.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, []);

  // Function to stop all currently playing notes
  const stopAllNotes = useCallback(() => {
    if (synthRef.current) synthRef.current.releaseAll();
  }, []);

  return { playNote, stopAllNotes };
};

function FretToneControls({ onApply, oscType: initialOscType = 'sawtooth', envelope: initialEnvelope = { attack: 0.005, decay: 0.5, sustain: 0.5, release: 1 } }) {
  const [oscType, setOscType] = useState(initialOscType);
  const [envelope, setEnvelope] = useState(initialEnvelope);
  const synthRef = useRef();
  const reverbRef = useRef();

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: oscType },
      envelope: { ...envelope },
      filter: { type: 'lowpass', frequency: 2000, rolloff: -12, Q: 1 }
    }).toDestination();
    reverbRef.current = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
    synthRef.current.connect(reverbRef.current);
    return () => {
      synthRef.current.dispose();
      reverbRef.current.dispose();
    };
  }, [oscType, envelope]);

  // If the parent changes the initial values, update local state
  useEffect(() => { setOscType(initialOscType); }, [initialOscType]);
  useEffect(() => { setEnvelope(initialEnvelope); }, [initialEnvelope]);

  // Play a test note
  const playTestNote = () => {
    if (Tone.context.state !== 'running') return;
    try { synthRef.current.triggerAttackRelease('C4', '8n'); } catch (e) { console.error(e); }
  };

  // Envelope slider handler
  const handleEnvChange = (param, value) => {
    setEnvelope(env => ({ ...env, [param]: parseFloat(value) }));
  };

  // Ensure Tone.js is started
  useEffect(() => {
    const startAudio = async () => { await Tone.start(); };
    document.addEventListener('click', startAudio, { once: true });
    return () => document.removeEventListener('click', startAudio);
  }, []);

  return (
    <div className="fret-tone-panel" style={{background:'#222',color:'#eee',padding:'2vmin',borderRadius:'1vmin',maxWidth:400}}>
      <h3>FretTone Synth Controls</h3>
      <div style={{marginBottom:'1vmin'}}>
        <label>Oscillator Type: </label>
        <select value={oscType} onChange={e => setOscType(e.target.value)}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1vmin'}}>
        {['attack','decay','sustain','release'].map(param => (
          <label key={param} style={{display:'flex',alignItems:'center',gap:'1vmin'}}>
            {param.charAt(0).toUpperCase()+param.slice(1)}:
            <input type="range" min={param==='sustain'?0:0.001} max={param==='attack'?0.5:param==='decay'?2:param==='release'?3:1} step={param==='attack'?0.001:0.01} value={envelope[param]} onChange={e=>handleEnvChange(param,e.target.value)} style={{flex:1}} />
            <span style={{width:40,textAlign:'right'}}>{envelope[param]}</span>
          </label>
        ))}
      </div>
      <div style={{display:'flex',gap:'1vmin',marginTop:'2vmin'}}>
        <button onClick={playTestNote}>Play Test Note</button>
        <button onClick={() => onApply && onApply({ oscType, envelope })}>Apply</button>
      </div>
    </div>
  );
}

export default function FretTone({ onBack, synthSettings, onApplySynthSettings }) {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4vmin',
    }}>
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          marginBottom: '2vmin',
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
        ← Return to Splash
      </button>
      <FretToneControls
        onApply={onApplySynthSettings}
        oscType={synthSettings?.oscType}
        envelope={synthSettings?.envelope}
      />
    </div>
  );
}

// Export the hook
export { useFretTone }; 