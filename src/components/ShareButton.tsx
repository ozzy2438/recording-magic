import React from 'react';
import { Icons } from './icons';

interface ShareButtonProps {
  type: 'email' | 'twitter';
  onClick: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  disabled: boolean;
}

export function ShareButton({ 
  type, 
  onClick, 
  isLoading, 
  isSuccess, 
  isError,
  disabled 
}: ShareButtonProps) {
  const getIcon = () => {
    if (isLoading) return <Icons.Loader className="w-5 h-5 animate-spin" />;
    if (isSuccess) return <Icons.Check className="w-5 h-5" />;
    if (isError) return <Icons.AlertCircle className="w-5 h-5" />;
    return type === 'email' ? <Icons.Mail className="w-5 h-5" /> : <Icons.Twitter className="w-5 h-5" />;
  };

  const getStyles = () => {
    const baseStyles = "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-white";
    
    if (disabled) return `${baseStyles} bg-gray-500 cursor-not-allowed opacity-50`;
    if (isLoading) return `${baseStyles} bg-gray-600 cursor-wait`;
    if (isSuccess) return `${baseStyles} bg-green-600 hover:bg-green-700`;
    if (isError) return `${baseStyles} bg-red-600 hover:bg-red-700`;
    
    return type === 'email'
      ? `${baseStyles} bg-gray-700 hover:bg-gray-600`
      : `${baseStyles} bg-blue-600 hover:bg-blue-500`;
  };

  const getLabel = () => {
    if (isLoading) return type === 'email' ? 'Opening Gmail...' : 'Opening Twitter...';
    if (isSuccess) return 'Opened!';
    if (isError) return 'Try Again';
    return type === 'email' ? 'Gmail' : 'Twitter';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={getStyles()}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
}