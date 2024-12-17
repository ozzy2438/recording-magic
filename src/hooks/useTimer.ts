import { useCallback, useRef } from 'react';

export function useTimer(onTick: (formattedTime: string) => void) {
  const startTime = useRef<number>(0);
  const elapsedPausedTime = useRef<number>(0);
  const pauseStartTime = useRef<number>(0);
  const timerInterval = useRef<number>();

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const elapsed = now - startTime.current - elapsedPausedTime.current;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${(seconds % 60)
      .toString()
      .padStart(2, '0')}`;
    onTick(formattedTime);
  }, [onTick]);

  const startTimer = useCallback(() => {
    startTime.current = Date.now();
    elapsedPausedTime.current = 0;
    timerInterval.current = window.setInterval(updateTimer, 1000);
  }, [updateTimer]);

  const pauseTimer = useCallback(() => {
    clearInterval(timerInterval.current);
    pauseStartTime.current = Date.now();
  }, []);

  const resumeTimer = useCallback(() => {
    elapsedPausedTime.current += Date.now() - pauseStartTime.current;
    timerInterval.current = window.setInterval(updateTimer, 1000);
  }, [updateTimer]);

  const stopTimer = useCallback(() => {
    clearInterval(timerInterval.current);
  }, []);

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  };
}