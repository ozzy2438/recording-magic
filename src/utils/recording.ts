import { MIME_TYPES } from '../constants/recording';

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const createRecordingFileName = (): string => {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `screen-recording-${timestamp}.webm`;
};

export const getMimeType = (): string => {
  return MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || 'video/webm';
};