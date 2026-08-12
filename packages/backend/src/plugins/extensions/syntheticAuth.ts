import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createProxyAuthenticator,
  createProxyAuthProviderFactory,
} from '@backstage/plugin-auth-node';

type SyntheticPersona = {
  providerId: string;
  entityRef: string;
  profile: {
    displayName: string;
    email: string;
  };
};

const syntheticPersonas: SyntheticPersona[] = [
  {
    providerId: 'synthetic-team-member-knekk',
    entityRef: 'user:default/kari-knekk',
    profile: {
      displayName: 'Team member — Kari Knekk',
      email: 'kari.knekk@example.invalid',
    },
  },
  {
    providerId: 'synthetic-team-member-seig',
    entityRef: 'user:default/siv-sukkerdrage',
    profile: {
      displayName: 'Team member — Siv Sukkerdragé',
      email: 'siv.sukkerdrage@example.invalid',
    },
  },
  {
    providerId: 'synthetic-multi-team-member',
    entityRef: 'user:default/mikkel-mellomlag',
    profile: {
      displayName: 'Multi-team member — Mikkel Mellomlag',
      email: 'mikkel.mellomlag@example.invalid',
    },
  },
  {
    providerId: 'synthetic-product-area-authority',
    entityRef: 'user:default/sjeflandmaler-for-sjokoladeruter',
    profile: {
      displayName: 'Product-area authority — Sjeflandmåler for sjokoladeruter',
      email: 'sjeflandmaler.sjokoladeruter@example.invalid',
    },
  },
  {
    providerId: 'synthetic-business-unit-authority',
    entityRef: 'user:default/direktor-for-faste-sotsaker',
    profile: {
      displayName:
        'Business-unit authority — Direktør for faste og stort sett faste søtsaker',
      email: 'direktor.faste.sotsaker@example.invalid',
    },
  },
  {
    providerId: 'synthetic-no-team',
    entityRef: 'user:default/den-omvandrende-smagodtplukkeren',
    profile: {
      displayName: 'No-team user — Den omvandrende smågodtplukkeren',
      email: 'omvandrende.smagodtplukker@example.invalid',
    },
  },
  {
    providerId: 'synthetic-administrator',
    entityRef: 'user:default/gullpapirets-vokter',
    profile: {
      displayName: 'Administrator — Gullpapirets vokter',
      email: 'gullpapirets.vokter@example.invalid',
    },
  },
];

export const authModuleSyntheticPersonas = createBackendModule({
  pluginId: 'auth',
  moduleId: 'synthetic-personas',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        for (const persona of syntheticPersonas) {
          const authenticator = createProxyAuthenticator({
            defaultProfileTransform: async result => ({
              profile: result.profile,
            }),
            initialize: () => undefined,
            async authenticate() {
              return { result: persona };
            },
          });

          providers.registerProvider({
            providerId: persona.providerId,
            factory: createProxyAuthProviderFactory({
              authenticator,
              async signInResolver({ result }, ctx) {
                return ctx.signInWithCatalogUser({
                  entityRef: result.entityRef,
                });
              },
            }),
          });
        }
      },
    });
  },
});
