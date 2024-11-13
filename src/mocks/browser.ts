import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create MSW worker instance
export const worker = setupWorker(...handlers);

// Initialize MSW
export async function initMsw() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      });
      console.log('✅ Mock Service Worker initialized');
    } catch (error) {
      console.error('❌ Error starting MSW:', error);
    }
  }
}