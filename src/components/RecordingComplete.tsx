import React, { useEffect, useCallback } from 'react';
import { Icons } from './icons';
import { ShareOptions } from './ShareOptions';
import { downloadVideo } from '../utils/download';
import { toast } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import { useRecordingStore } from '../store/recordingStore';

interface RecordingCompleteProps {
  videoBlob: Blob;
  duration: number;
  recordingType: string;
  layout: string | null;
  hasAudio: boolean;
  hasCamera: boolean;
  onClose: () => void;
}

export function RecordingComplete({
  videoBlob,
  duration,
  recordingType,
  layout,
  hasAudio,
  hasCamera,
  onClose,
}: RecordingCompleteProps) {
  const { user } = useAuth();
  const { saveRecording, fetchRecordings } = useRecordingStore();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!user) {
      toast.error('Lütfen giriş yapın');
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      console.log('Kayıt başlıyor...');
      await saveRecording(videoBlob, {
        title: `Kayıt ${new Date().toLocaleString('tr-TR')}`,
        duration,
        recording_type: recordingType,
        layout,
        has_audio: hasAudio,
        has_camera: hasCamera,
      });

      console.log('Kayıt başarılı!');
      toast.success('Kayıt başarıyla kaydedildi');
      await fetchRecordings();
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setSaveError(error instanceof Error ? error.message : 'Kayıt sırasında bir hata oluştu');
      toast.error('Kayıt başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  }, [videoBlob, user, duration, recordingType, layout, hasAudio, hasCamera, saveRecording, fetchRecordings, isSaving]);

  // Kaydetme işlemini bir kere çalıştır
  useEffect(() => {
    handleSave();
  }, [handleSave]);

  // Komponent kaldırılmadan önce medya bağlantılarını temizle
  useEffect(() => {
    return () => {
      if (hasAudio || hasCamera) {
        navigator.mediaDevices.getUserMedia({ audio: hasAudio, video: hasCamera })
          .then(stream => {
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(err => console.error('Medya bağlantısı kapatılırken hata:', err));
      }
    };
  }, [hasAudio, hasCamera]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isSaving ? (
              <Icons.Loader className="w-8 h-8 text-blue-500 animate-spin" />
            ) : saveError ? (
              <Icons.AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Icons.Check className="w-8 h-8 text-green-500" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {isSaving ? 'Kaydediliyor...' : saveError ? 'Kayıt Hatası' : 'Kayıt Tamamlandı!'}
          </h3>
          <p className="text-gray-400">
            {isSaving ? 'Lütfen bekleyin...' : saveError ? saveError : 'Kaydınız otomatik olarak kaydedildi'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => downloadVideo(videoBlob)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
            disabled={isSaving}
          >
            <Icons.Download className="w-5 h-5" />
            Kaydı İndir
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">veya paylaş</span>
            </div>
          </div>

          <ShareOptions videoBlob={videoBlob} />
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
          disabled={isSaving}
        >
          Yeni Kayıt Başlat
        </button>
      </div>
    </div>
  );
}