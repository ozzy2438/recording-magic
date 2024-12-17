export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recordings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          duration: number
          file_path: string
          file_size: number
          mime_type: string
          recording_type: string
          layout: string | null
          has_audio: boolean
          has_camera: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          duration: number
          file_path: string
          file_size: number
          mime_type: string
          recording_type: string
          layout?: string | null
          has_audio?: boolean
          has_camera?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          duration?: number
          file_path?: string
          file_size?: number
          mime_type?: string
          recording_type?: string
          layout?: string | null
          has_audio?: boolean
          has_camera?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
    }
  }
}