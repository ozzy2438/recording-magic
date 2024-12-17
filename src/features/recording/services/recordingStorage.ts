import { supabase } from '../../../lib/supabase';

export const recordingStorage = {
  async upload(file: Blob, userId: string): Promise<string | null> {
    try {
      const fileName = `${userId}/${Date.now()}-recording.webm`;
      
      const { error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, file, {
          contentType: 'video/webm',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  },

  async delete(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('recordings')
        .remove([filePath]);

      return !error;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }
}