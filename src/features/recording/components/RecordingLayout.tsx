import React from 'react';
import { RecordingControls } from './RecordingControls';
import { SourceSelector } from './SourceSelector';
import { VideoPreview } from './VideoPreview';
import { RecordingComplete } from './RecordingComplete';
import { SavedRecordings } from './SavedRecordings';
import { useRecordingControls } from '../hooks/useRecordingControls';
import { useSavedRecordings } from '../hooks/useSavedRecordings';

export function RecordingLayout() {
  const controls = useRecordingControls();
  const { recordings, isLoading, deleteRecording } = useSavedRecordings();

  const handlePlayRecording = (recording: any) => {
    window.open(recording.file_path, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {controls.showSourceSelector ? (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Record your screen</h2>
                <p className="text-gray-400">Choose your recording options</p>
              </div>

              {controls.error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                  {controls.error}
                </div>
              )}
              
              <SourceSelector
                selectedSource={controls.selectedSource}
                audioEnabled={controls.audioEnabled}
                micEnabled={controls.micEnabled}
                onSourceSelect={controls.setSelectedSource}
                onAudioToggle={() => controls.setAudioEnabled(!controls.audioEnabled)}
                onMicToggle={() => controls.setMicEnabled(!controls.micEnabled)}
              />

              <div className="flex justify-center pt-4">
                <button
                  onClick={controls.handleStart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center gap-2"
                >
                  Start Recording
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-white mb-6">Saved Recordings</h2>
            <SavedRecordings
              recordings={recordings}
              onDelete={deleteRecording}
              onPlay={handlePlayRecording}
              isLoading={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <VideoPreview
            screenStream={controls.screenStream}
            cameraStream={controls.cameraStream}
            layout={controls.selectedLayout}
          />
          <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
            <RecordingControls
              isRecording={controls.isRecording}
              isPaused={controls.isPaused}
              onStart={controls.handleStart}
              onPause={controls.pauseRecording}
              onStop={controls.handleStop}
              recordingTime={controls.recordingTime}
            />
          </div>
        </div>
      )}

      {controls.recordedBlob && !controls.showSourceSelector && (
        <RecordingComplete
          videoBlob={controls.recordedBlob}
          duration={controls.recordingDuration}
          recordingType={controls.selectedSource}
          layout={controls.selectedLayout}
          hasAudio={controls.audioEnabled}
          hasCamera={controls.selectedSource === 'camera-screen'}
          onClose={controls.handleNewRecording}
        />
      )}
    </div>
  );
}