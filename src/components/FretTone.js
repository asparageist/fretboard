import React, { useEffect, useCallback } from 'react';
import * as Tone from 'tone';

// Custom hook for audio functionality
const useFretTone = () => {
  // Create a synthesizer instance with guitar-like settings
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'sawtooth', // Options: 'sine', 'square', 'sawtooth', 'triangle'
      // You can also use 'custom' and provide a custom waveform
      //TODO: add a waveform selector button
    },
    envelope: {
      attack: 0.005,  // Very quick attack for plucked sound
      decay: 0.5,     // Quick decay
      sustain: 0.5,   // Moderate sustain
      release: 1    // Moderate release
    },
    // Add a filter for more guitar-like tone
    filter: {
      type: 'lowpass',
      frequency: 2000, // Cut off high frequencies
      rolloff: -12,    // Filter slope
      Q: 1            // Resonance
    }
  }).toDestination();

  // Add some effects for more realistic sound
  const reverb = new Tone.Reverb({
    decay: 2,      // Reverb decay time
    wet: 0.3         // Mix of dry/wet signal
  }).toDestination();

  // Connect synth to reverb
  synth.connect(reverb);

  // Initialize Tone.js
  useEffect(() => {
    // Start the audio context on first user interaction
    const startAudio = async () => {
      await Tone.start();
      console.log('Audio context started');
    };

    // Add click listener to start audio
    document.addEventListener('click', startAudio, { once: true });

    // Cleanup function
    return () => {
      document.removeEventListener('click', startAudio);
      synth.dispose();
      reverb.dispose();
    };
  }, []);

  // Function to play a note
  const playNote = useCallback((note, duration = '8n') => {
    if (Tone.context.state !== 'running') {
      console.log('Audio context not started');
      return;
    }

    try {
      // Trigger the note attack
      synth.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, []);

  // Function to stop all currently playing notes
  const stopAllNotes = useCallback(() => {
    synth.releaseAll();
  }, []);

  return { playNote, stopAllNotes };
};

// Export the hook
export default useFretTone; 