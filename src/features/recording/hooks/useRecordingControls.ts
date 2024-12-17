import { useState, useCallback } from 'react';
import { useRecorder } from './useRecorder';
import { SOURCE_TYPES } from '../constants';

export function useRecordingControls() {
  const [showSourceSelector, setShowSourceSelector] = useState(true);
  const [selectedSource, setSelectedSource] = useState(SOURCE_TYPES.CAMERA_SCREEN);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  
  const recorder = useRecorder();

  const handleStart = useCallback(async () => {
    await recorder.startRecording(selectedSource, audioEnabled, micEnabled);
    if (!recorder.error) {
      setShowSourceSelector(false);
    }
  }, [selectedSource, audioEnabled, micEnabled, recorder]);

  const handleStop = useCallback(() => {
    recorder.stopRecording();
  }, [recorder]);

  const handleNewRecording = useCallback(() => {
    setShowSourceSelector(true);
  }, []);

  return {
    ...recorder,
    showSourceSelector,
    selectedSource,
    audioEnabled,
    micEnabled,
    setSelectedSource,
    setAudioEnabled,
    setMicEnabled,
    handleStart,
    handleStop,
    handleNewRecording,
  };
}