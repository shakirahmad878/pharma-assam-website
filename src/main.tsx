import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import AppWebsite from './AppWebsite.tsx';

// Determine application mode from hostname, environment, or query parameter:
// - nlcl.in, www.nlcl.in -> Pure Corporate Website (AppWebsite)
// - reppulse.nlcl.in -> Pure RepPulse SFA / Admin Portal (App)
const resolveIsWebsite = (): boolean => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    const search = window.location.search.toLowerCase();
    
    // Explicit query override for testing
    if (search.includes('view=website')) return true;
    if (search.includes('view=portal') || search.includes('view=sfa')) return false;

    // Subdomain & domain routing
    if (host === 'reppulse.nlcl.in') return false;
    if (host === 'nlcl.in' || host === 'www.nlcl.in' || host.includes('pharma-assam-website')) return true;
  }

  // Fallback to build-time mode
  return (
    import.meta.env.VITE_APP_MODE === 'website' || 
    import.meta.env.MODE === 'website'
  );
};

const isWebsiteMode = resolveIsWebsite();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isWebsiteMode ? <AppWebsite /> : <App />}
  </StrictMode>,
);
