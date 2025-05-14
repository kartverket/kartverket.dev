import '@backstage/cli/asset-types';
import App from './App';
import posthog from 'posthog-js';
import '@backstage/canon/css/styles.css';
import { createRoot } from 'react-dom/client';

posthog.init('phc_5i5QBLfgf4FXS4hJlnkrLsAzQERS8PALDPmF2YVFQsB', {
  api_host: 'https://eu.posthog.com',
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
