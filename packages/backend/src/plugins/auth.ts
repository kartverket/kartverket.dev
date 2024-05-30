import {
  createRouter,
  providers,
  defaultAuthProviderFactories, getDefaultOwnershipEntityRefs, OAuth2ProxyResult,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {AuthResolverContext, commonSignInResolvers, ProfileInfo} from "@backstage/plugin-auth-node";
import {Entity, stringifyEntityRef} from "@backstage/catalog-model";
import {CatalogApi, CatalogClient} from "@backstage/catalog-client";
import emailMatchingUserEntityProfileEmail = commonSignInResolvers.emailMatchingUserEntityProfileEmail;
import {jwtDecode, JwtPayload} from "jwt-decode";

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
      istio: providers.oauth2Proxy.create({
        authHandler: async (result, ctx) => {
          const entity = await getUserFromResult(result, ctx);
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
            const entity = await getUserFromResult(result, ctx);
            const ownershipRefs = getDefaultOwnershipEntityRefs(entity)

            return ctx.issueToken({
              claims: {
                sub: stringifyEntityRef(entity),
                ent: ownershipRefs,
                groups: await getGroupDisplayNamesForEntity(ownershipRefs, catalogApi)
              }
            })
          }
        }
      }),
      google: providers.google.create({
        signIn: {
          resolver: emailMatchingUserEntityProfileEmail(),
        },
      }),
      github: providers.github.create({
        signIn: {
          async resolver({result}, ctx) {
            const { entity } = await ctx.findCatalogUser({
              annotations: {
                'microsoft.com/email': result.fullProfile.username!,
              }
            })
            const ownershipRefs = getDefaultOwnershipEntityRefs(entity)

            return ctx.issueToken({
              claims: {
                sub: stringifyEntityRef(entity),
                ent: ownershipRefs,
                groups: await getGroupDisplayNamesForEntity(ownershipRefs, catalogApi)
              }
            })
          }
        }
      })
    },
  });
}

async function getUserFromResult(result: OAuth2ProxyResult, ctx: AuthResolverContext): Promise<Entity> {
  const authHeader= result.getHeader('authorization');

  if (!authHeader) {
    throw new Error('Request did not contain an authorization header');
  }

  const token = jwtDecode<JwtPayload>(authHeader.split(' ')[1])
  const email = <string>( token as any).upn

  if (!email) {
    throw new Error('Request did not contain an email');
  }

  const { entity } = await ctx.findCatalogUser({
    annotations: {
      'microsoft.com/email': email,
    }
  })

  return entity;
}

// Add group display names as claim to the issued backstage token.
// This is used for DASKs onboarding plugin
async function getGroupDisplayNamesForEntity(ownershipRefs: string[], catalogApi: CatalogApi): Promise<string[]> {
  const groupEntitiesUsingDisplayName = await catalogApi.getEntitiesByRefs({entityRefs: ownershipRefs});

  const groupDisplayNames: string[] = await Promise.all(
      groupEntitiesUsingDisplayName.items
          //@ts-ignore
          .filter(e => e != undefined && e.spec && e.kind == 'Group' && e.spec.profile && e.spec.profile.displayName)
          .map(async e => {
            let parentGroup: Entity | undefined;
            if (e!.spec!.parent) {
              parentGroup = await catalogApi.getEntityByRef(e!.spec!.parent as string);
            }
            let groupName;
            if (parentGroup) {
              //@ts-ignore
              groupName = `${parentGroup!.spec!.profile!.displayName}:${e!.spec!.profile!.displayName}`;
            } else {
              //@ts-ignore
              groupName = e!.spec!.profile!.displayName;
            }
            return groupName;
          })
  );
  return groupDisplayNames;
}


