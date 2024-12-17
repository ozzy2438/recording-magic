import React, { useState } from 'react';
import { ShareButton } from './ShareButton';
import { sharing } from '../utils/sharing';
import { toast } from '../utils/toast';

interface ShareOptionsProps {
  videoBlob: Blob;
}

type ShareStatus = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

const initialShareStatus: ShareStatus = {
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export function ShareOptions({ videoBlob }: ShareOptionsProps) {
  const [emailStatus, setEmailStatus] = useState<ShareStatus>(initialShareStatus);
  const [twitterStatus, setTwitterStatus] = useState<ShareStatus>(initialShareStatus);

  const handleEmailShare = async () => {
    setEmailStatus({ isLoading: true, isSuccess: false, isError: false });
    
    try {
      const success = await sharing.email(videoBlob);

      if (success) {
        setEmailStatus({ isLoading: false, isSuccess: true, isError: false });
        toast.success('Opening email client...');
      } else {
        throw new Error('Failed to open email client');
      }
    } catch (error) {
      setEmailStatus({ isLoading: false, isSuccess: false, isError: true });
      toast.error('Failed to open email client. Please try again.');
    }
  };

  const handleTwitterShare = async () => {
    setTwitterStatus({ isLoading: true, isSuccess: false, isError: false });
    
    try {
      const success = await sharing.twitter(videoBlob);

      if (success) {
        setTwitterStatus({ isLoading: false, isSuccess: true, isError: false });
        toast.success('Opening Twitter...');
      } else {
        throw new Error('Failed to open Twitter');
      }
    } catch (error) {
      setTwitterStatus({ isLoading: false, isSuccess: false, isError: true });
      toast.error('Failed to open Twitter. Please try again.');
    }
  };

  return (
    <div className="flex gap-4">
      <ShareButton
        type="email"
        onClick={handleEmailShare}
        isLoading={emailStatus.isLoading}
        isSuccess={emailStatus.isSuccess}
        isError={emailStatus.isError}
        disabled={twitterStatus.isLoading}
      />
      <ShareButton
        type="twitter"
        onClick={handleTwitterShare}
        isLoading={twitterStatus.isLoading}
        isSuccess={twitterStatus.isSuccess}
        isError={twitterStatus.isError}
        disabled={emailStatus.isLoading}
      />
    </div>
  );
}