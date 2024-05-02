import {
  createRouter,
  providers,
  defaultAuthProviderFactories, getDefaultOwnershipEntityRefs,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {ProfileInfo} from "@backstage/plugin-auth-node";
import {stringifyEntityRef} from "@backstage/catalog-model";
import {CatalogClient} from "@backstage/catalog-client";

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery })

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      // This replaces the default GitHub auth provider with a customized one.
      // The `signIn` option enables sign-in for this provider, using the
      // identity resolution logic that's provided in the `resolver` callback.
      //
      // This particular resolver makes all users share a single "guest" identity.
      // It should only be used for testing and trying out Backstage.
      //
      // If you want to use a production ready resolver you can switch to
      // the one that is commented out below, it looks up a user entity in the
      // catalog using the GitHub username of the authenticated user.
      // That resolver requires you to have user entities populated in the catalog,
      // for example using https://backstage.io/docs/integrations/github/org
      //
      // There are other resolvers to choose from, and you can also create
      // your own, see the auth documentation for more details:
      //
      //   https://backstage.io/docs/auth/identity-resolver
      oauth2Proxy: providers.oauth2Proxy.create({
        authHandler: async (result, ctx) => {
          const email = result.getHeader('x-auth-request-email');
          if (!email) {
            throw new Error('Request did not contain an email');
          }
          const { entity } = await ctx.findCatalogUser({
            annotations: {
              'microsoft.com/email': email,
            }
          })
          let profileInfo
          if (typeof entity.spec?.profile != undefined) {
            profileInfo = entity.spec?.profile as ProfileInfo
          } else {
            throw new Error('Profile is not available')
          }
          return {
            profile: profileInfo,
          };
        },
        signIn: {
          async resolver({result}, ctx) {
            const email = result.getHeader('x-auth-request-email')
            if (!email) {
              throw new Error('Request did not contain an email');
            }

            const { entity } = await ctx.findCatalogUser({
              annotations: {
                'microsoft.com/email': email,
              }
            })

            const ownershipRefs = getDefaultOwnershipEntityRefs(entity)

            // Add group display names as claim to the issued backstage token.
            // This is used for DASKs onboarding plugin
            const groupEntitiesUsingDisplayName = await catalogApi.getEntitiesByRefs({entityRefs: ownershipRefs})
            const groupDisplayNames: string[] =
                groupEntitiesUsingDisplayName.items
                    // @ts-ignore
                    .filter(e => e != undefined && e.spec && e.kind == 'Group' && e.spec.profile && e.spec.profile.displayName)
                    // @ts-ignore
                    .map(e => e!.spec!.profile!.displayName as string)

            return ctx.issueToken({
              claims: {
                sub: stringifyEntityRef(entity),
                ent: ownershipRefs,
                groups: groupDisplayNames
              }
            })
          }
        }
      }),
    },
  });
}
