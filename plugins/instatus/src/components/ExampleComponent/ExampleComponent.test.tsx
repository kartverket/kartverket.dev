import { ExampleComponent } from './ExampleComponent';
import { http } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import { renderInTestApp, registerMswTestHooks } from '@backstage/test-utils';

describe('ExampleComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  // setup mock response
  beforeEach(() => {
    server.use(http.get('/*', _ => new Response('{}', { status: 200 })));
  });

  it('should render', async () => {
    await renderInTestApp(<ExampleComponent />);
    expect(screen.getByText('Welcome to instatus!')).toBeInTheDocument();
  });
});
