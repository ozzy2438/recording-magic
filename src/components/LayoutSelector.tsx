import React from 'react';
import { LAYOUTS } from '../constants/recording';

interface LayoutSelectorProps {
  selectedLayout: string;
  onLayoutSelect: (layout: string) => void;
}

export function LayoutSelector({ selectedLayout, onLayoutSelect }: LayoutSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Layout Options</h3>
      <div className="grid grid-cols-2 gap-4">
        <LayoutOption
          layout={LAYOUTS.SCREEN_ONLY}
          selected={selectedLayout === LAYOUTS.SCREEN_ONLY}
          onClick={() => onLayoutSelect(LAYOUTS.SCREEN_ONLY)}
          label="Screen Only"
        >
          <div className="w-full h-24 bg-gray-200 rounded-lg" />
        </LayoutOption>

        <LayoutOption
          layout={LAYOUTS.CAMERA_RIGHT}
          selected={selectedLayout === LAYOUTS.CAMERA_RIGHT}
          onClick={() => onLayoutSelect(LAYOUTS.CAMERA_RIGHT)}
          label="Camera Right"
        >
          <div className="flex gap-2">
            <div className="flex-grow h-24 bg-gray-200 rounded-lg" />
            <div className="w-16 h-24 bg-gray-300 rounded-lg" />
          </div>
        </LayoutOption>

        <LayoutOption
          layout={LAYOUTS.CAMERA_LEFT}
          selected={selectedLayout === LAYOUTS.CAMERA_LEFT}
          onClick={() => onLayoutSelect(LAYOUTS.CAMERA_LEFT)}
          label="Camera Left"
        >
          <div className="flex gap-2">
            <div className="w-16 h-24 bg-gray-300 rounded-lg" />
            <div className="flex-grow h-24 bg-gray-200 rounded-lg" />
          </div>
        </LayoutOption>

        <LayoutOption
          layout={LAYOUTS.SPLIT_SCREEN}
          selected={selectedLayout === LAYOUTS.SPLIT_SCREEN}
          onClick={() => onLayoutSelect(LAYOUTS.SPLIT_SCREEN)}
          label="Split Screen"
        >
          <div className="flex gap-2">
            <div className="flex-1 h-24 bg-gray-200 rounded-lg" />
            <div className="flex-1 h-24 bg-gray-300 rounded-lg" />
          </div>
        </LayoutOption>
      </div>
    </div>
  );
}

interface LayoutOptionProps {
  layout: string;
  selected: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

function LayoutOption({ selected, onClick, label, children }: LayoutOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
      }`}
    >
      {children}
      <span className="block mt-2 text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}