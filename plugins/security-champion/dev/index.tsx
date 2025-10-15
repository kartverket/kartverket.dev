import { createDevApp } from '@backstage/dev-utils';
import { securityChampionPlugin, SecurityChampionPage } from '../src/plugin';

createDevApp()
  .registerPlugin(securityChampionPlugin)
  .addPage({
    element: <SecurityChampionPage />,
    title: 'Root Page',
    path: '/security-champion',
  })
  .render();
