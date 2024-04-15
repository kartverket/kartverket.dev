import '@backstage/cli/asset-types';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import posthog from 'posthog-js'

posthog.init('phc_5i5QBLfgf4FXS4hJlnkrLsAzQERS8PALDPmF2YVFQsB', { api_host: 'https://eu.posthog.com' })
ReactDOM.render(<App />, document.getElementById('root'));
