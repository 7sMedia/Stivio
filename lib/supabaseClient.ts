import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://phwklfbggmalosniqhjb.supabase.co"; // Replace with your real URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBod2tsZmJnZ21hbG9zbmlxaGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDgyMTQsImV4cCI6MjA2NjMyNDIxNH0._U6PWjqHA2b7SfB-NqWFs0mYCgfS_N0TSsUWnhXFiT8"; // Replace with your real key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
