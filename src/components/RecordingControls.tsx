import React from 'react';
import { Icons } from './icons';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  recordingTime: string;
}

export function RecordingControls({
  isRecording,
  isPaused,
  onStart,
  onPause,
  onStop,
  recordingTime,
}: RecordingControlsProps) {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg px-6 py-3 flex items-center space-x-6">
      {isRecording ? (
        <>
          <button
            onClick={onPause}
            className="p-3 rounded-full hover:bg-gray-700 transition-colors"
            aria-label={isPaused ? "Resume recording" : "Pause recording"}
          >
            {isPaused ? (
              <Icons.Play className="w-6 h-6 text-blue-400" />
            ) : (
              <Icons.Pause className="w-6 h-6 text-blue-400" />
            )}
          </button>
          <div className="px-4 py-1 bg-red-900/50 rounded-full">
            <span className="text-red-200 font-medium">{recordingTime}</span>
          </div>
          <button
            onClick={onStop}
            className="p-3 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Stop recording"
          >
            <Icons.Square className="w-6 h-6 text-red-400 fill-current" />
          </button>
        </>
      ) : (
        <button
          onClick={onStart}
          className="p-3 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Start recording"
        >
          <Icons.Play className="w-6 h-6 text-blue-400" />
        </button>
      )}
    </div>
  );
}