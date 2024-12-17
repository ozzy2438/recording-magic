import { useEffect } from 'react';
import { useRecordingStore } from '../store/recordingStore';
import { useAuth } from '../context/AuthContext';

export function useSavedRecordings() {
  const { user } = useAuth();
  const { 
    recordings,
    isLoading,
    error,
    fetchRecordings,
    saveRecording,
    deleteRecording
  } = useRecordingStore();

  useEffect(() => {
    if (user) {
      fetchRecordings();
    }
  }, [user, fetchRecordings]);

  return {
    recordings,
    isLoading,
    error,
    saveRecording,
    deleteRecording,
    refreshRecordings: fetchRecordings
  };
}