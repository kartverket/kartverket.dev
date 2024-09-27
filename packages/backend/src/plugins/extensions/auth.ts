import {
    AuthService,
    BackendModuleRegistrationPoints,
    coreServices,
    createBackendModule
} from "@backstage/backend-plugin-api";
import {
    authProvidersExtensionPoint, createOAuthProviderFactory,
} from "@backstage/plugin-auth-node";
import {Entity, stringifyEntityRef} from "@backstage/catalog-model";
import {CatalogApi, CatalogClient} from "@backstage/catalog-client";
import { AuthenticationError } from '@backstage/errors';
import {getDefaultOwnershipEntityRefs} from "@backstage/plugin-auth-backend";
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import { microsoftAuthenticator } from '@backstage/plugin-auth-backend-module-microsoft-provider';
import {jwtDecode} from "jwt-decode";

interface JWTClaims {
    oid: string
    [key: string]: any
}

function getObjectIdFromToken(token: string): string {
    const decodedToken: JWTClaims = jwtDecode<JWTClaims>(token)
    return decodedToken.oid
}

export const authModuleGithubLocalProvider = createBackendModule({
    pluginId: 'auth',
    moduleId: 'githubLocalProvider',
    register(reg: BackendModuleRegistrationPoints) {
        reg.registerInit({
            deps: {
                providers: authProvidersExtensionPoint,
                discovery: coreServices.discovery,
                auth: coreServices.auth,
            },
            async init({ providers, discovery, auth}) {
                providers.registerProvider({
                    providerId: 'github',
                    factory: createOAuthProviderFactory({
                        authenticator: githubAuthenticator,
                        async signInResolver(info, ctx) {
                            const catalogApi = new CatalogClient({ discoveryApi: discovery })
                            const username = info.result.fullProfile.username
                            if (!username) {
                                throw new AuthenticationError('Authentication failed', "No username found in profile");
                            }
                            const { entity } = await ctx.findCatalogUser({
                                annotations: {
                                    'microsoft.com/email': info.result.fullProfile.username as string,
                                }
                            })
                            if (!entity) {
                                throw new AuthenticationError('Authentication failed', "No user found in catalog");
                            }
                            const ownershipRefs = getDefaultOwnershipEntityRefs(entity)
                            return ctx.issueToken({
                                claims: {
                                    sub: stringifyEntityRef(entity),
                                    ent: ownershipRefs,
                                    groups: await getGroupDisplayNamesForEntity(ownershipRefs, catalogApi, auth)
                                }
                            })
                        }
                    })
                })
            }
        })
    }
})

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
            async init({ providers, discovery, auth}) {
                providers.registerProvider({
                    providerId: 'microsoft',
                    factory: createOAuthProviderFactory({
                        authenticator: microsoftAuthenticator,
                        async signInResolver(info, ctx) {
                            const catalogApi = new CatalogClient({ discoveryApi: discovery })
                            const { result } = info

                            if (!result.session.accessToken) {
                                throw new AuthenticationError(
                                    "Login failed, OAuth session did not contain an access token",
                                )
                            }

                            const oid = getObjectIdFromToken(
                                result.session.accessToken,
                            )
                            const { entity } = await ctx.findCatalogUser({
                                annotations: {
                                    "graph.microsoft.com/user-id": oid,
                                }
                            })
                            if (!entity) {
                                throw new AuthenticationError('Authentication failed', "No user found in catalog");
                            }
                            const ownershipRefs = getDefaultOwnershipEntityRefs(entity)
                            return ctx.issueToken({
                                claims: {
                                    sub: stringifyEntityRef(entity),
                                    ent: ownershipRefs,
                                    groups: await getGroupDisplayNamesForEntity(ownershipRefs, catalogApi, auth)
                                }
                            })
                        }
                    })
                })
            }
        })
    }
})


// Add group display names as claim to the issued backstage token.
// This is used for DASKs onboarding plugin
async function getGroupDisplayNamesForEntity(ownershipRefs: string[], catalogApi: CatalogApi, auth: AuthService): Promise<string[]> {
    const { token } = await auth.getPluginRequestToken({
        onBehalfOf: await auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog', // e.g. 'catalog'
    });
    const groupEntitiesUsingDisplayName = await catalogApi.getEntitiesByRefs({entityRefs: ownershipRefs}, {token: token});
    const groupDisplayNames: string[] = await Promise.all(
        groupEntitiesUsingDisplayName.items
            //@ts-ignore
            .filter(e => e != undefined && e.spec && e.kind == 'Group' && e.spec.profile && e.spec.profile.displayName)
            .map(async e => {
                let parentGroup: Entity | undefined;
                if (e!.spec!.parent) {
                    parentGroup = await catalogApi.getEntityByRef(e!.spec!.parent as string, {token: token});
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