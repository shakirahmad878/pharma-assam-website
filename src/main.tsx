import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import AppWebsite from './AppWebsite.tsx';

// Determine application mode from environment or dev URL query parameter
// In portal build (reppulse-pharma-sfa): isWebsiteMode is false -> Pure SFA/Admin Portal
// In website build (pharma-assam-website): isWebsiteMode is true -> Pure Corporate Website
const isWebsiteMode = 
  import.meta.env.VITE_APP_MODE === 'website' || 
  import.meta.env.MODE === 'website' ||
  (typeof window !== 'undefined' && window.location.search.includes('view=website'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isWebsiteMode ? <AppWebsite /> : <App />}
  </StrictMode>,
);
