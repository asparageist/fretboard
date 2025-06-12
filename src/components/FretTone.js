import React, { useEffect, useCallback } from 'react';
import * as Tone from 'tone';

// Custom hook for audio functionality
const useFretTone = () => {
  // Create a synthesizer instance
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'sine' // Basic waveform type
    },
    envelope: {
      attack: 0.02,  // How quickly the note starts
      decay: 0.1,    // How quickly it fades to sustain level
      sustain: 0.3,  // The level it maintains while held
      release: 1     // How quickly it fades out when released
    }
  }).toDestination(); // Connect to the audio output

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
      synth.dispose(); // Clean up the synthesizer
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