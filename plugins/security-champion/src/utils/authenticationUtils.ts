import { IdentityApi, OAuthApi } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

export async function getAuthenticationTokens(
  config: Config,
  backstageAuthApi: IdentityApi,
  microsoftAuthApi: OAuthApi,
): Promise<{ entraIdToken: string; backstageToken: string }> {
  const environment = config.getString('auth.environment');
  const clientId = config.getString(
    `auth.providers.microsoft.${environment}.clientId`,
  );

  const backstageToken = (await backstageAuthApi.getCredentials()).token;
  if (!backstageToken) {
    throw new Error('Backstage token could not be retrieved.');
  }

  let entraIdToken: string;
  try {
    const token = await microsoftAuthApi.getAccessToken(`${clientId}/.default`);
    if (!token) {
      throw new Error('Entra ID token is undefined.');
    }
    entraIdToken = token;
  } catch (error) {
    throw new Error(
      `Failed to get Entra ID token: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return { entraIdToken, backstageToken };
}

export async function getBackstageToken(
  backstageAuthApi: IdentityApi,
): Promise<{ backstageToken: string }> {
  const backstageToken = (await backstageAuthApi.getCredentials()).token;
  if (!backstageToken) {
    throw new Error('Backstage token could not be retrieved.');
  }

  return { backstageToken };
}
