import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://dhpcfkjnfnefgqrxrjqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocGNma2puZm5lZmdxcnhyanF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTMzMDEsImV4cCI6MjA0OTk4OTMwMX0.6oFwTr8TJnJ4pwCq9El4buOj25vpFOq3yDAys_or8Pg';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});