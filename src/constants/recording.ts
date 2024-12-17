export const MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
] as const;

export const SOURCE_TYPES = {
  SCREEN: 'screen',
  WINDOW: 'window',
  CAMERA_SCREEN: 'camera-screen',
} as const;

export const LAYOUTS = {
  SCREEN_ONLY: 'screen-only',
  CAMERA_RIGHT: 'camera-right',
  CAMERA_LEFT: 'camera-left',
  CAMERA_BOTTOM_RIGHT: 'camera-bottom-right',
  CAMERA_BOTTOM_LEFT: 'camera-bottom-left',
  SPLIT_SCREEN: 'split-screen',
} as const;