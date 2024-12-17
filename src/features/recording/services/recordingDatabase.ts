import { supabase } from '../../../lib/supabase';
import type { Recording } from '../types';

export const recordingDatabase = {
  async save(recording: Omit<Recording, 'id' | 'created_at' | 'updated_at'>) {
    const { error } = await supabase
      .from('recordings')
      .insert(recording);

    if (error) throw error;
  },

  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async softDelete(id: string) {
    const { error } = await supabase
      .from('recordings')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
}