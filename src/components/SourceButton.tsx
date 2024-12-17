import React from 'react';

interface SourceButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export function SourceButton({ icon, label, description, isSelected, onClick }: SourceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all duration-200 text-center w-full ${
        isSelected
          ? 'border-blue-500 bg-blue-900/20 shadow-md'
          : 'border-gray-700 hover:border-blue-400 hover:bg-gray-700/50'
      }`}
    >
      {icon}
      <span className="block text-lg font-semibold text-white mb-1">{label}</span>
      <span className="block text-sm text-gray-400">{description}</span>
    </button>
  );
}