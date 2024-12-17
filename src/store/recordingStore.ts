import { create } from 'zustand';
import { recordingService } from '../services/recordingService';
import type { Recording } from '../types/recordings';

interface RecordingMetadata {
  title: string;
  duration: number;
  recording_type: string;
  layout: string | null;
  has_audio: boolean;
  has_camera: boolean;
}

interface RecordingState {
  recordings: Recording[];
  isLoading: boolean;
  error: string | null;
  fetchRecordings: () => Promise<void>;
  saveRecording: (blob: Blob, metadata: RecordingMetadata) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useRecordingStore = create<RecordingState>((set, get) => ({
  recordings: [],
  isLoading: false,
  error: null,

  fetchRecordings: async () => {
    try {
      const recordings = await recordingService.getUserRecordings();
      set({ recordings, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Kayıtlar yüklenirken hata oluştu';
      set({ error: errorMessage });
      throw error;
    }
  },

  saveRecording: async (blob: Blob, metadata: RecordingMetadata) => {
    try {
      await recordingService.saveRecording(blob, metadata);
      const recordings = await recordingService.getUserRecordings();
      set({ recordings, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Kayıt kaydedilirken hata oluştu';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteRecording: async (id: string) => {
    try {
      await recordingService.deleteRecording(id);
      set(state => ({
        recordings: state.recordings.filter(r => r.id !== id),
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Kayıt silinirken hata oluştu';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));