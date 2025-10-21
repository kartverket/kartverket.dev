import { catalogCreatorPlugin } from './plugin';

describe('catalog-creator', () => {
  it('should export plugin', () => {
    expect(catalogCreatorPlugin).toBeDefined();
  });
});
