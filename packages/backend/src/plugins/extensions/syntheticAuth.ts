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
    providerId: 'synthetic-atlas',
    entityRef: 'user:default/ada',
    profile: {
      displayName: 'Ada Example — Team Atlas member',
      email: 'ada@example.invalid',
    },
  },
  {
    providerId: 'synthetic-compass',
    entityRef: 'user:default/linus',
    profile: {
      displayName: 'Linus Example — Team Compass member',
      email: 'linus@example.invalid',
    },
  },
  {
    providerId: 'synthetic-multiteam',
    entityRef: 'user:default/grace',
    profile: {
      displayName: 'Grace Example — member of multiple teams',
      email: 'grace@example.invalid',
    },
  },
  {
    providerId: 'synthetic-product-area',
    entityRef: 'user:default/product-area-authority',
    profile: {
      displayName: 'Synthetic product-area authority',
      email: 'product-area-authority@example.invalid',
    },
  },
  {
    providerId: 'synthetic-business-unit',
    entityRef: 'user:default/business-unit-authority',
    profile: {
      displayName: 'Synthetic business-unit authority',
      email: 'business-unit-authority@example.invalid',
    },
  },
  {
    providerId: 'synthetic-unaffiliated',
    entityRef: 'user:default/unaffiliated-developer',
    profile: {
      displayName: 'Synthetic developer without a team',
      email: 'unaffiliated-developer@example.invalid',
    },
  },
  {
    providerId: 'synthetic-admin',
    entityRef: 'user:default/synthetic-admin',
    profile: {
      displayName: 'Synthetic administrator and reporting user',
      email: 'synthetic-admin@example.invalid',
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
