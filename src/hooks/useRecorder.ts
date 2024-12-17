import { useState, useCallback, useRef } from 'react';
import { useTimer } from './useTimer';
import { getMimeType } from '../utils/recording';
import { toast } from '../utils/toast';

interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: string;
  mediaRecorder: MediaRecorder | null;
  screenStream: MediaStream | null;
  cameraStream: MediaStream | null;
  error: string | null;
  recordedBlob: Blob | null;
  recordingDuration: number;
}

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: '00:00',
    mediaRecorder: null,
    screenStream: null,
    cameraStream: null,
    error: null,
    recordedBlob: null,
    recordingDuration: 0,
  });

  const chunks = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  
  const { startTimer, pauseTimer, resumeTimer, stopTimer, getElapsedTime } = useTimer(
    (formattedTime) => setState((prev) => ({ ...prev, recordingTime: formattedTime }))
  );

  const startRecording = useCallback(async (
    source: string,
    audioEnabled: boolean,
    micEnabled: boolean,
    layout: string
  ) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: audioEnabled
      });

      // Get camera stream if needed
      let cameraStream = null;
      if (source === 'camera-screen') {
        try {
          cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: micEnabled
          });
        } catch (err) {
          console.error('Camera access error:', err);
          toast.error('Could not access camera. Please check permissions.');
          return;
        }
      }

      // Create final stream
      const tracks = [...screenStream.getTracks()];
      if (cameraStream) {
        tracks.push(...cameraStream.getTracks());
      }

      const finalStream = new MediaStream(tracks);
      const recorder = new MediaRecorder(finalStream, {
        mimeType: getMimeType()
      });
      
      chunks.current = [];
      startTimeRef.current = Date.now();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const blob = new Blob(chunks.current, { type: getMimeType() });
        setState(prev => ({
          ...prev,
          recordedBlob: blob,
          recordingDuration: duration
        }));
        
        tracks.forEach(track => track.stop());
      };

      recorder.start(1000);
      startTimer();

      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        mediaRecorder: recorder,
        screenStream,
        cameraStream,
      }));
    } catch (error: any) {
      console.error('Error starting recording:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to start recording'
      }));
    }
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
      stopTimer();
      setState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        recordingTime: '00:00',
        mediaRecorder: null
      }));
    }
  }, [state.mediaRecorder, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (state.mediaRecorder?.state === 'recording') {
      state.mediaRecorder.pause();
      pauseTimer();
      setState(prev => ({ ...prev, isPaused: true }));
    } else if (state.mediaRecorder?.state === 'paused') {
      state.mediaRecorder.resume();
      resumeTimer();
      setState(prev => ({ ...prev, isPaused: false }));
    }
  }, [state.mediaRecorder, pauseTimer, resumeTimer]);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
  };
}