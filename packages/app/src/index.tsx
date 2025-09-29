import '@backstage/cli/asset-types';
import App from './App';
import '@backstage/ui/css/styles.css';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
