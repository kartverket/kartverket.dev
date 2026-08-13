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
    providerId: 'synthetic-team-member-knekk',
    title: 'Team member — Kari Knekk',
    message:
      'Medlem av Lag Knekk. Tester tilgang til lagets egen Sjokoladematrikkel.',
    apiRef: createApiRef({ id: 'auth.synthetic.team-member-knekk' }),
  },
  {
    providerId: 'synthetic-team-member-seig',
    title: 'Team member — Siv Sukkerdragé',
    message:
      'Medlem av Lag Seig. Tester tilgang til et annet lag og på tvers av laggrenser.',
    apiRef: createApiRef({ id: 'auth.synthetic.team-member-seig' }),
  },
  {
    providerId: 'synthetic-multi-team-member',
    title: 'Multi-team member — Mikkel Mellomlag',
    message:
      'Medlem av både Lag Knekk og Lag Skum. Tester tilgang gjennom flere lag.',
    apiRef: createApiRef({ id: 'auth.synthetic.multi-team-member' }),
  },
  {
    providerId: 'synthetic-product-area-authority',
    title: 'Product-area authority — Sjeflandmåler for sjokoladeruter',
    message:
      'Medlem av produktområdet Spiselig eiendom. Tester myndighet på tvers av alle underliggende lag.',
    apiRef: createApiRef({ id: 'auth.synthetic.product-area-authority' }),
  },
  {
    providerId: 'synthetic-business-unit-authority',
    title:
      'Business-unit authority — Direktør for faste og stort sett faste søtsaker',
    message:
      'Medlem av Avdeling for sjokolade og fast eiendom. Tester myndighet på tvers av hele avdelingen.',
    apiRef: createApiRef({ id: 'auth.synthetic.business-unit-authority' }),
  },
  {
    providerId: 'synthetic-no-team',
    title: 'No-team user — Den omvandrende smågodtplukkeren',
    message:
      'Har ingen gruppemedlemskap. Tester tomme visninger og avvist tilgang.',
    apiRef: createApiRef({ id: 'auth.synthetic.no-team' }),
  },
  {
    providerId: 'synthetic-administrator',
    title: 'Administrator — Gullpapirets vokter',
    message:
      'Tester administrator- og rapporteringstilgang for hele Godteriverket.',
    apiRef: createApiRef({ id: 'auth.synthetic.administrator' }),
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
