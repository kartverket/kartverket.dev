import {
  AuthService,
  BackendModuleRegistrationPoints,
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import { AuthenticationError } from '@backstage/errors';
import { microsoftAuthenticator } from '@backstage/plugin-auth-backend-module-microsoft-provider';
import { jwtDecode } from 'jwt-decode';

type JWTClaims = {
  oid: string;
  [key: string]: unknown;
};

type GroupEntityWithDisplayName = Entity & {
  kind: 'Group';
  spec: Entity['spec'] & {
    parent?: string;
    profile: {
      displayName: string;
    };
  };
};

const hasDisplayName = (
  entity: Entity | undefined,
): entity is GroupEntityWithDisplayName => {
  if (entity?.kind !== 'Group') {
    return false;
  }

  const profile = Reflect.get(entity.spec ?? {}, 'profile');
  if (!profile || typeof profile !== 'object') {
    return false;
  }

  return typeof Reflect.get(profile, 'displayName') === 'string';
};

const getDisplayName = (entity: Entity | undefined): string | undefined => {
  return hasDisplayName(entity) ? entity.spec.profile.displayName : undefined;
};

function getObjectIdFromToken(token: string): string {
  const decodedToken = jwtDecode<JWTClaims>(token);
  return decodedToken.oid;
}

export const authModuleMicrosoftProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'microsoftGraphProvider',
  register(reg: BackendModuleRegistrationPoints) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
      },
      async init({ providers, discovery, auth }) {
        providers.registerProvider({
          providerId: 'microsoft',
          factory: createOAuthProviderFactory({
            authenticator: microsoftAuthenticator,
            async signInResolver(info, ctx) {
              const catalogApi = new CatalogClient({ discoveryApi: discovery });
              const { result } = info;

              if (!result.session.accessToken) {
                throw new AuthenticationError(
                  'Login failed, OAuth session did not contain an access token',
                );
              }

              const oid = getObjectIdFromToken(result.session.accessToken);
              const { entity } = await ctx.findCatalogUser({
                annotations: {
                  'graph.microsoft.com/user-id': oid,
                },
              });
              if (!entity) {
                throw new AuthenticationError(
                  'Authentication failed',
                  'No user found in catalog',
                );
              }
              const ownershipRefs = (
                await ctx.resolveOwnershipEntityRefs(entity)
              ).ownershipEntityRefs;

              return ctx.issueToken({
                claims: {
                  sub: stringifyEntityRef(entity),
                  ent: ownershipRefs,
                  groups: await getGroupDisplayNamesForEntity(
                    ownershipRefs,
                    catalogApi,
                    auth,
                  ),
                },
              });
            },
          }),
        });
      },
    });
  },
});

// Add group display names as claim to the issued backstage token.
// This is used for DASKs onboarding plugin
async function getGroupDisplayNamesForEntity(
  ownershipRefs: string[],
  catalogApi: CatalogApi,
  auth: AuthService,
): Promise<string[]> {
  const { token } = await auth.getPluginRequestToken({
    onBehalfOf: await auth.getOwnServiceCredentials(),
    targetPluginId: 'catalog', // e.g. 'catalog'
  });
  const groupEntitiesUsingDisplayName = await catalogApi.getEntitiesByRefs(
    { entityRefs: ownershipRefs },
    { token: token },
  );
  const groupDisplayNames: string[] = await Promise.all(
    groupEntitiesUsingDisplayName.items
      .filter(hasDisplayName)
      .map(async entity => {
        const parentRef = entity.spec.parent;
        const parentGroup =
          typeof parentRef === 'string'
            ? await catalogApi.getEntityByRef(parentRef, { token })
            : undefined;
        const parentDisplayName = getDisplayName(parentGroup);

        return parentDisplayName
          ? `${parentDisplayName}:${entity.spec.profile.displayName}`
          : entity.spec.profile.displayName;
      }),
  );
  return groupDisplayNames;
}
