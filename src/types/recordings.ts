export interface Recording {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  duration: number;
  file_path: string;
  file_size: number;
  mime_type: string;
  recording_type: string;
  layout: string | null;
  has_audio: boolean;
  has_camera: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}