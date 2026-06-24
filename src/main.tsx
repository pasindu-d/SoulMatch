import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { handleClientSideFallback } from './apiMockFallback.ts';

// Set up a transparent API interceptor for environments without a running Express backend (like Vercel deployments or client-only modes)
const originalFetch = window.fetch;
const interceptor = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : (input instanceof URL ? input.href : input.url);
  if (url.startsWith('/api/')) {
    try {
      const response = await originalFetch(input, init);
      // Status 405 (Method Not Allowed) or 404 (Not Found) means the route is handled as static, i.e., no Express backend
      if (response.status === 405 || response.status === 404) {
        console.warn(`[API] Endpoint ${url} returned ${response.status}. Falling back to client-side localStorage state.`);
        return await handleClientSideFallback(url, init);
      }
      return response;
    } catch (err) {
      console.warn(`[API] Connection to ${url} failed. Falling back to client-side localStorage state.`, err);
      return await handleClientSideFallback(url, init);
    }
  }
  return originalFetch(input, init);
};

// Use Object.defineProperty to bypass readonly or prototype getter restrictions
try {
  Object.defineProperty(window, 'fetch', {
    value: interceptor,
    writable: true,
    configurable: true
  });
} catch (e) {
  console.warn("Failed to define window.fetch via Object.defineProperty, trying assignment fallback", e);
  try {
    (window as any).fetch = interceptor;
  } catch (err2) {
    console.error("Critical: Could not override window.fetch", err2);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
 
