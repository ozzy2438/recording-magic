import React, { useEffect, useCallback } from 'react';
import { Icons } from './icons';
import { formatDuration } from '../utils/format';
import { useRecordingStore } from '../store/recordingStore';
import { toast } from '../utils/toast';

interface Recording {
  id: string;
  title: string;
  duration: number;
  file_path: string;
  created_at: string;
}

export function SavedRecordings() {
  const { recordings, isLoading, fetchRecordings } = useRecordingStore();

  const refreshRecordings = useCallback(async () => {
    try {
      await fetchRecordings();
    } catch (error) {
      console.error('Kayıtlar yüklenirken hata:', error);
    }
  }, [fetchRecordings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const setupAutoRefresh = () => {
      refreshRecordings();
      interval = setInterval(refreshRecordings, 5000);
    };

    setupAutoRefresh();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [refreshRecordings]);

  const handleDelete = async (id: string) => {
    try {
      await useRecordingStore.getState().deleteRecording(id);
      toast.success('Kayıt silindi');
      await refreshRecordings();
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Kayıt silinirken hata oluştu');
    }
  };

  const handlePlay = (recording: Recording) => {
    const videoUrl = `file://${recording.file_path}`;
    window.open(videoUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!recordings || recordings.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <Icons.Video className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-300">Henüz kayıt yok</h3>
        <p className="text-gray-500 mt-1">Kayıtlarınız burada görünecek</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {recordings.map((recording) => (
        <div
          key={recording.id}
          className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 group hover:bg-gray-700/50 transition-colors"
        >
          <div 
            className="w-32 h-20 bg-black rounded overflow-hidden cursor-pointer relative group"
            onClick={() => handlePlay(recording)}
          >
            <video src={`file://${recording.file_path}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Icons.Play className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white truncate">{recording.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
              <span>{formatDuration(recording.duration)}</span>
              <span>•</span>
              <span>{new Date(recording.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>

          <button
            onClick={() => handleDelete(recording.id)}
            className="p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Kaydı sil"
          >
            <Icons.Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}