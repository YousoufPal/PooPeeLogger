import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esnzrqdscyxhzzwtnnmi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbnpycWRzY3l4aHp6d3Rubm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMTAxMTQsImV4cCI6MjA1NzU4NjExNH0.BrJe3cNEcDLm3JN3q9_WRseB-SIdKXDVgd2nWDbo7P4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);