import * as fs from 'fs';
import * as path from 'path';

class StorageService {
  private readonly uploadDir = 'uploads';

  constructor() {
    // Uploads klasörünü oluştur
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(blob: Blob, userId: string): Promise<string> {
    try {
      const buffer = Buffer.from(await blob.arrayBuffer());
      const fileName = `${userId}-${Date.now()}.webm`;
      const filePath = path.join(this.uploadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      
      return filePath;
    } catch (error) {
      console.error('Dosya kaydetme hatası:', error);
      throw new Error('Dosya kaydedilemedi');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Dosya silme hatası:', error);
      throw new Error('Dosya silinemedi');
    }
  }
}

export const storageService = new StorageService(); 