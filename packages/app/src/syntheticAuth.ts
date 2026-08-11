import { AuthConnector, OAuth2, OAuth2Session } from '@backstage/core-app-api';
import { SignInProviderConfig } from '@backstage/core-components';
import {
  AnyApiFactory,
  ApiRef,
  BackstageIdentityApi,
  BackstageIdentityResponse,
  DiscoveryApi,
  ProfileInfo,
  ProfileInfoApi,
  SessionApi,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

type SyntheticAuthApi = ProfileInfoApi & BackstageIdentityApi & SessionApi;

type SyntheticPersonaDefinition = {
  providerId: string;
  title: string;
  message: string;
  apiRef: ApiRef<SyntheticAuthApi>;
};

type ProxySessionResponse = {
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentityResponse;
};

const definitions: SyntheticPersonaDefinition[] = [
  {
    providerId: 'synthetic-atlas',
    title: 'Team Atlas developer',
    message: 'Member of Team Atlas. Owns the synthetic map platform.',
    apiRef: createApiRef({ id: 'auth.synthetic.atlas' }),
  },
  {
    providerId: 'synthetic-compass',
    title: 'Team Compass developer',
    message:
      'Member of Team Compass. Useful for testing access across team boundaries.',
    apiRef: createApiRef({ id: 'auth.synthetic.compass' }),
  },
  {
    providerId: 'synthetic-multiteam',
    title: 'Multi-team developer',
    message: 'Member of Team Atlas and Team Portal.',
    apiRef: createApiRef({ id: 'auth.synthetic.multiteam' }),
  },
  {
    providerId: 'synthetic-product-area',
    title: 'Product-area authority',
    message:
      'Represents authority across the Geospatial Platform product area.',
    apiRef: createApiRef({ id: 'auth.synthetic.product-area' }),
  },
  {
    providerId: 'synthetic-business-unit',
    title: 'Business-unit authority',
    message: 'Represents authority across the Geodata business unit.',
    apiRef: createApiRef({ id: 'auth.synthetic.business-unit' }),
  },
  {
    providerId: 'synthetic-unaffiliated',
    title: 'Developer without a team',
    message: 'Has no group memberships. Useful for empty and denied states.',
    apiRef: createApiRef({ id: 'auth.synthetic.unaffiliated' }),
  },
  {
    providerId: 'synthetic-admin',
    title: 'Synthetic administrator',
    message: 'Represents administrator and reporting access in synthetic data.',
    apiRef: createApiRef({ id: 'auth.synthetic.admin' }),
  },
];

function createSyntheticConnector(
  discoveryApi: DiscoveryApi,
  providerId: string,
): AuthConnector<OAuth2Session> {
  const getSession = async (): Promise<OAuth2Session> => {
    const authBaseUrl = await discoveryApi.getBaseUrl('auth');
    const response = await fetch(`${authBaseUrl}/${providerId}/refresh`, {
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Synthetic sign-in failed for '${providerId}' (${response.status}): ${detail}`,
      );
    }

    const session = (await response.json()) as ProxySessionResponse;
    return {
      profile: session.profile,
      backstageIdentity: session.backstageIdentity,
      providerInfo: {
        accessToken: '',
        idToken: '',
        scopes: new Set(),
      },
    };
  };

  return {
    createSession: getSession,
    refreshSession: getSession,
    async removeSession() {},
  };
}

export const syntheticAuthApiFactories: AnyApiFactory[] = definitions.map(
  definition =>
    createApiFactory({
      api: definition.apiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) =>
        OAuth2.create({
          authConnector: createSyntheticConnector(
            discoveryApi,
            definition.providerId,
          ),
        }),
    }),
);

export const syntheticSignInProviders: SignInProviderConfig[] = definitions.map(
  definition => ({
    id: definition.providerId,
    title: definition.title,
    message: definition.message,
    apiRef: definition.apiRef,
  }),
);
