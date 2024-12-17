import { Pool } from 'pg';
import { toast } from '../utils/toast';
import { storageService } from './storageService';

const pool = new Pool({
  user: 'osmanorka',
  host: 'localhost',
  database: 'screen_recorder',
  password: 'Allah248012',
  port: 5432,
});

interface RecordingMetadata {
  title: string;
  duration: number;
  recording_type: string;
  layout: string | null;
  has_audio: boolean;
  has_camera: boolean;
}

class RecordingService {
  private async uploadToStorage(blob: Blob, userId: string): Promise<string> {
    return await storageService.saveFile(blob, userId);
  }

  private async getCurrentUser() {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['osmanorka@gmail.com']
    );
    return result.rows[0];
  }

  async saveRecording(blob: Blob, metadata: RecordingMetadata): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 1. Get current user
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('Lütfen giriş yapın');
      }

      // 2. Upload file
      console.log('Dosya yükleniyor...');
      const filePath = await this.uploadToStorage(blob, user.id);
      console.log('Dosya yüklendi:', filePath);

      // 3. Save to database
      console.log('Veritabanına kaydediliyor...');
      const result = await client.query(
        `INSERT INTO recordings 
        (user_id, title, duration, file_path, file_size, mime_type, recording_type, layout, has_audio, has_camera)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
        [
          user.id,
          metadata.title || `Kayıt ${new Date().toLocaleString('tr-TR')}`,
          metadata.duration,
          filePath,
          blob.size,
          'video/webm',
          metadata.recording_type || 'screen',
          metadata.layout,
          metadata.has_audio,
          metadata.has_camera
        ]
      );

      await client.query('COMMIT');
      console.log('Kayıt başarılı!');
      toast.success('Kayıt başarıyla kaydedildi');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Kayıt hatası:', error);
      toast.error(error instanceof Error ? error.message : 'Kayıt sırasında bir hata oluştu');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserRecordings() {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('Lütfen giriş yapın');
      }

      const result = await pool.query(
        `SELECT * FROM recordings 
        WHERE user_id = $1 
        AND deleted_at IS NULL 
        ORDER BY created_at DESC`,
        [user.id]
      );

      return result.rows;
    } catch (error) {
      console.error('Kayıtları getirme hatası:', error);
      throw error;
    }
  }

  async deleteRecording(id: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get recording info
      const recordingResult = await client.query(
        'SELECT file_path FROM recordings WHERE id = $1',
        [id]
      );

      if (recordingResult.rows.length === 0) {
        throw new Error('Kayıt bulunamadı');
      }

      const filePath = recordingResult.rows[0].file_path;

      // Delete file
      await storageService.deleteFile(filePath);

      // Soft delete in database
      const result = await client.query(
        `UPDATE recordings 
        SET deleted_at = CURRENT_TIMESTAMP 
        WHERE id = $1`,
        [id]
      );

      await client.query('COMMIT');

      if (result.rowCount > 0) {
        toast.success('Kayıt silindi');
      }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Silme hatası:', error);
      toast.error('Kayıt silinirken hata oluştu');
      throw error;
    } finally {
      client.release();
    }
  }
}

export const recordingService = new RecordingService();