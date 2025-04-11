import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { instatusPlugin, InstatusPage } from '../src/plugin';

createDevApp()
  .registerPlugin(instatusPlugin)
  .addPage({
    element: <InstatusPage />,
    title: 'Root Page',
    path: '/instatus'
  })
  .render();
