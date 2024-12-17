import React, { useEffect, useRef } from 'react';
import { LAYOUTS } from '../constants/recording';

interface VideoPreviewProps {
  screenStream: MediaStream | null;
  cameraStream: MediaStream | null;
  layout: string;
}

export function VideoPreview({ screenStream, cameraStream, layout }: VideoPreviewProps) {
  const screenRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (screenRef.current && screenStream) {
      screenRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  useEffect(() => {
    if (cameraRef.current && cameraStream) {
      cameraRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  if (!screenStream) return null;

  const getLayoutStyles = () => {
    const baseScreenStyles = "w-full h-full object-contain bg-black";
    const baseCameraStyles = "w-full h-full object-cover transform scale-x-[-1] bg-black";
    
    switch (layout) {
      case LAYOUTS.CAMERA_RIGHT:
        return {
          container: "fixed inset-0 bg-black",
          screen: baseScreenStyles,
          cameraWrapper: "fixed bottom-8 right-8 w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-black z-10",
          camera: baseCameraStyles
        };
      case LAYOUTS.CAMERA_LEFT:
        return {
          container: "fixed inset-0 bg-black",
          screen: baseScreenStyles,
          cameraWrapper: "fixed bottom-8 left-8 w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-black z-10",
          camera: baseCameraStyles
        };
      case LAYOUTS.SPLIT_SCREEN:
        return {
          container: "fixed inset-0 grid grid-cols-2 gap-2 p-4 bg-black",
          screen: baseScreenStyles,
          cameraWrapper: "w-full h-full bg-black",
          camera: "w-full h-full object-contain transform scale-x-[-1]"
        };
      default:
        return {
          container: "fixed inset-0 bg-black",
          screen: baseScreenStyles,
          cameraWrapper: "",
          camera: ""
        };
    }
  };

  const styles = getLayoutStyles();

  return (
    <div className={styles.container}>
      <video
        ref={screenRef}
        autoPlay
        playsInline
        muted
        className={styles.screen}
      />
      {cameraStream && layout !== LAYOUTS.SCREEN_ONLY && (
        <div className={styles.cameraWrapper}>
          <video
            ref={cameraRef}
            autoPlay
            playsInline
            muted
            className={styles.camera}
          />
        </div>
      )}
    </div>
  );
}