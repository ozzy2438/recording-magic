import React, { useState } from 'react';
import { RecordingControls } from './components/RecordingControls';
import { SourceSelector } from './components/SourceSelector';
import { VideoPreview } from './components/VideoPreview';
import { LayoutSelector } from './components/LayoutSelector';
import { RecordingComplete } from './components/RecordingComplete';
import { SavedRecordings } from './components/SavedRecordings';
import { AuthRequired } from './components/AuthRequired';
import { useRecorder } from './hooks/useRecorder';
import { useSavedRecordings } from './hooks/useSavedRecordings';
import { SOURCE_TYPES, LAYOUTS } from './constants/recording';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [selectedSource, setSelectedSource] = useState(SOURCE_TYPES.CAMERA_SCREEN);
  const [selectedLayout, setSelectedLayout] = useState(LAYOUTS.CAMERA_RIGHT);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [showSourceSelector, setShowSourceSelector] = useState(true);
  
  const {
    isRecording,
    isPaused,
    recordingTime,
    screenStream,
    cameraStream,
    error,
    recordedBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    recordingDuration,
  } = useRecorder();

  const { recordings, isLoading, deleteRecording } = useSavedRecordings();

  const handleStart = async () => {
    await startRecording(selectedSource, audioEnabled, micEnabled, selectedLayout);
    if (!error) {
      setShowSourceSelector(false);
    }
  };

  const handleStop = () => {
    stopRecording();
  };

  const handleNewRecording = () => {
    setShowSourceSelector(true);
  };

  const handlePlayRecording = (recording: any) => {
    window.open(recording.file_path, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AuthRequired>
        {showSourceSelector ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Record your screen</h2>
                  <p className="text-gray-400">Choose your recording options</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                    {error}
                  </div>
                )}
                
                <div className="space-y-8">
                  <SourceSelector
                    onSourceSelect={setSelectedSource}
                    selectedSource={selectedSource}
                    audioEnabled={audioEnabled}
                    micEnabled={micEnabled}
                    onAudioToggle={() => setAudioEnabled(!audioEnabled)}
                    onMicToggle={() => setMicEnabled(!micEnabled)}
                  />

                  {selectedSource === SOURCE_TYPES.CAMERA_SCREEN && (
                    <LayoutSelector
                      selectedLayout={selectedLayout}
                      onLayoutSelect={setSelectedLayout}
                    />
                  )}

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleStart}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      Start Recording
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Recordings Section */}
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
              screenStream={screenStream}
              cameraStream={cameraStream}
              layout={selectedLayout}
            />
            <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
              <RecordingControls
                isRecording={isRecording}
                isPaused={isPaused}
                onStart={handleStart}
                onPause={pauseRecording}
                onStop={handleStop}
                recordingTime={recordingTime}
              />
            </div>
          </div>
        )}

        {recordedBlob && !showSourceSelector && (
          <RecordingComplete
            videoBlob={recordedBlob}
            duration={recordingDuration}
            recordingType={selectedSource}
            layout={selectedLayout}
            hasAudio={audioEnabled}
            hasCamera={selectedSource === SOURCE_TYPES.CAMERA_SCREEN}
            onClose={handleNewRecording}
          />
        )}
      </AuthRequired>
    </div>
  );
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}