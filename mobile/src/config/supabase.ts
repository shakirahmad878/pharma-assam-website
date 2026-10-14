/**
 * RepPulse Pharma SFA — Supabase Serverless PostgreSQL Configuration
 */

export const SUPABASE_CONFIG = {
  url: 'https://ibcyqtnpzdttwuhyhlra.supabase.co',
  apiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3lxdG5wemR0dHd1aHlobHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTc0ODcsImV4cCI6MjEwNzQ3MzQ4N30.JTMIcW9cz-G1NbEpKFl1Vg3AN46jHktpbGO5SAykjuI',
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.apiKey);
};
