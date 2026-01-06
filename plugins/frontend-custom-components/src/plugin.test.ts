import { frontendCustomComponentsPlugin } from './plugin';

describe('frontend-custom-components', () => {
  it('should export plugin', () => {
    expect(frontendCustomComponentsPlugin).toBeDefined();
  });
});
