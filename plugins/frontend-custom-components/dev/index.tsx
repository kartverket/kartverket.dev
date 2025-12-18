import { createDevApp } from '@backstage/dev-utils';
import { frontendCustomComponentsPlugin, FrontendCustomComponentsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(frontendCustomComponentsPlugin)
  .addPage({
    element: <FrontendCustomComponentsPage />,
    title: 'Root Page',
    path: '/frontend-custom-components',
  })
  .render();
