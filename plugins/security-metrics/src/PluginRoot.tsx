import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { AppContext } from './components/AppContext';
import { MetricsPlugin } from './MetricsPlugin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const emotionInsertionPoint = document.createElement('meta');
emotionInsertionPoint.setAttribute('name', 'emotion-insertion-point');
document.querySelector('head')?.appendChild(emotionInsertionPoint);

const cache = createCache({
  key: 'css',
  insertionPoint: emotionInsertionPoint,
});

const queryClient = new QueryClient();

const ProvidedPlugin = () => {
  const [isUsingNewFeature, setIsUsingNewFeature] = useState(false);
  return (
    <AppContext.Provider value={{ isUsingNewFeature, setIsUsingNewFeature }}>
      <CacheProvider value={cache}>
        <QueryClientProvider client={queryClient}>
          <MetricsPlugin />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </CacheProvider>
    </AppContext.Provider>
  );
};

export const PluginRoot = () => (
  <Routes>
    <Route path="/" element={<ProvidedPlugin />} />
  </Routes>
);
