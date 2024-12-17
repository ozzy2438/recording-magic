import { shareService } from '../services';

export const sharing = {
  async email(videoBlob: Blob): Promise<boolean> {
    try {
      return await shareService.shareViaEmail({
        videoBlob,
        credentials: {
          email: 'osmanorka@gmail.com',
          password: 'Allah248012'
        }
      });
    } catch (error) {
      console.error('Email sharing error:', error);
      return false;
    }
  },

  async twitter(videoBlob: Blob): Promise<boolean> {
    try {
      return await shareService.shareViaTwitter({
        videoBlob,
        credentials: {
          username: '@ozmin2410',
          password: 'Allah248012'
        }
      });
    } catch (error) {
      console.error('Twitter sharing error:', error);
      return false;
    }
  }
};