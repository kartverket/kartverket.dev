import { IdentityApi } from '@backstage/core-plugin-api';

export async function getBackstageToken(
  backstageAuthApi: IdentityApi,
): Promise<{ backstageToken: string }> {
  const backstageToken = (await backstageAuthApi.getCredentials()).token;
  if (!backstageToken) {
    throw new Error('Backstage token could not be retrieved.');
  }

  return { backstageToken };
}
