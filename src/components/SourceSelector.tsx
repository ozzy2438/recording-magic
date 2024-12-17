import React from 'react';
import { Icons } from './icons';
import { Toggle } from './Toggle';
import { SourceButton } from './SourceButton';
import { SOURCE_TYPES } from '../constants/recording';

interface SourceSelectorProps {
  onSourceSelect: (source: string) => void;
  selectedSource: string;
  audioEnabled: boolean;
  micEnabled: boolean;
  onAudioToggle: () => void;
  onMicToggle: () => void;
}

export function SourceSelector({
  onSourceSelect,
  selectedSource,
  audioEnabled,
  micEnabled,
  onAudioToggle,
  onMicToggle,
}: SourceSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SourceButton
          icon={<Icons.Monitor className="w-12 h-12 mb-3 mx-auto text-gray-300" />}
          label="Screen + Camera"
          description="Record your screen with camera overlay"
          isSelected={selectedSource === SOURCE_TYPES.CAMERA_SCREEN}
          onClick={() => onSourceSelect(SOURCE_TYPES.CAMERA_SCREEN)}
        />
        
        <SourceButton
          icon={<Icons.Monitor className="w-12 h-12 mb-3 mx-auto text-gray-300" />}
          label="Screen Only"
          description="Record your screen without camera"
          isSelected={selectedSource === SOURCE_TYPES.SCREEN}
          onClick={() => onSourceSelect(SOURCE_TYPES.SCREEN)}
        />
      </div>

      <div className="space-y-5 bg-gray-700/50 p-6 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">AUDIO SOURCES</h3>
        <Toggle
          icon={<Icons.Volume2 className="w-5 h-5 text-gray-300" />}
          label="System Audio"
          description="Record audio from your computer"
          enabled={audioEnabled}
          onToggle={onAudioToggle}
        />

        <Toggle
          icon={<Icons.Mic className="w-5 h-5 text-gray-300" />}
          label="Microphone"
          description="Record from your microphone"
          enabled={micEnabled}
          onToggle={onMicToggle}
        />
      </div>
    </div>
  );
}