import { createDevApp } from '@backstage/dev-utils';
import { regelrettSchemasPlugin, RegelrettSchemasPage } from '../src/plugin';

createDevApp()
  .registerPlugin(regelrettSchemasPlugin)
  .addPage({
    element: <RegelrettSchemasPage />,
    title: 'Root Page',
    path: '/regelrett-schemas',
  })
  .render();
