/**
 * RepPulse Pharma SFA — Supabase Serverless PostgreSQL Configuration
 */

export const SUPABASE_CONFIG = {
  url: 'https://ibcyqtnpzdttwuhyhlra.supabase.co',
  apiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3lxdG5wemR0dHd1aHlobHJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTg5NzQ4NywiZXhwIjoyMTA3NDczNDg3fQ.UIIV5WGQR52cBsDGg-jS8DD1ZVGTl5bZ7a5MSLmUDhA',
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.apiKey);
};
