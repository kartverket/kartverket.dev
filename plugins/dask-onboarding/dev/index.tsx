import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { daskOnboardingPlugin, DaskOnboardingPage } from '../src/plugin';

createDevApp()
  .registerPlugin(daskOnboardingPlugin)
  .addPage({
    element: <DaskOnboardingPage />,
    title: 'Root Page',
    path: '/dask-onboarding'
  })
  .render();
