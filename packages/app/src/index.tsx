import '@backstage/cli/asset-types';
import App from './App';
import '@backstage/ui/css/styles.css';
import { createRoot } from 'react-dom/client';
import '@kartverket/backstage-plugin-risk-scorecard/css/theme.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
