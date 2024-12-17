import { mockApi } from './mockApi';

interface ShareOptions {
  videoBlob: Blob;
  credentials: {
    email?: string;
    username?: string;
    password: string;
  };
}

class ShareService {
  private createFormData(videoBlob: Blob, credentials: ShareOptions['credentials']): FormData {
    const formData = new FormData();
    formData.append('video', videoBlob, `screen-recording-${Date.now()}.webm`);
    
    if (credentials.email) {
      formData.append('email', credentials.email);
    }
    if (credentials.username) {
      formData.append('username', credentials.username);
    }
    formData.append('password', credentials.password);
    
    return formData;
  }

  async shareViaEmail({ videoBlob, credentials }: ShareOptions): Promise<boolean> {
    try {
      const formData = this.createFormData(videoBlob, credentials);
      return await mockApi.shareViaEmail(formData);
    } catch (error) {
      console.error('Email sharing error:', error);
      return false;
    }
  }

  async shareViaTwitter({ videoBlob, credentials }: ShareOptions): Promise<boolean> {
    try {
      const formData = this.createFormData(videoBlob, credentials);
      return await mockApi.shareViaTwitter(formData);
    } catch (error) {
      console.error('Twitter sharing error:', error);
      return false;
    }
  }
}

export const shareService = new ShareService();