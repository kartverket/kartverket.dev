import {coreServices, createBackendModule} from '@backstage/backend-plugin-api';
import {
    processingResult,
    CatalogProcessor,
    CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';

import {LocationSpec} from '@backstage/plugin-catalog-common';
import {Entity} from "@backstage/catalog-model";
import {Config} from "@backstage/config";

export const catalogModuleGithubTransformer = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'github-transformer',
    register(reg) {
        reg.registerInit({
            deps: {logger: coreServices.logger},
            async init({logger}) {
                logger.info('Hello World!')
            },
        });
    },
});


// A processor that reads KV-mails based on Security Champion GitHub handles.
export class SecurityChampionGroupProcessor implements CatalogProcessor {
    constructor(private readonly config: Config) {
    }

    getProcessorName(): string {
        return 'SecurityChampionGroupProcessor';
    }

    async readLocation(
        location: LocationSpec,
        _optional: boolean,
        emit: CatalogProcessorEmit,
    ): Promise<boolean> {
        // Pick a custom location type string. A location will be
        // registered later with this type.
        if (location.type !== 'Group') {
            return false;
        }

        try {
            // Use the builtin reader facility to grab data from the
            // API. If you prefer, you can just use plain fetch here
            // (from the node-fetch package), or any other method of
            // your choosing.
            return true
            // Repeatedly call emit(processingResult.entity(location, <entity>))
        } catch (error) {
            const message = `Unable to read ${location.type}, ${error}`;
            emit(processingResult.generalError(location, message));
        }

        return true;
    }

    async getEntraIDToken(entraIdCredentialsConfig: Config, sikkerhetsmetrikkerConfig: Config): Promise<string> {
        const entraIDBody = {
            grant_type: "client_credentials",
            client_id: entraIdCredentialsConfig.getString("clientId"),
            client_secret: entraIdCredentialsConfig.getString("clientSecret"),
            scope: sikkerhetsmetrikkerConfig.getString("clientId") + "/.default"
        }
        const postRequestOptions: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(entraIDBody).toString()
        }
        return fetch("https://login.microsoftonline.com/7f74c8a2-43ce-46b2-b0e8-b6306cba73a3/oauth2/v2.0/token", postRequestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status.toString())
                }
                return response.json()
            })
            .then(body => {
                return body["access_token"]
            })
            .catch(error => {
                console.error('An error occurred when fetching Entra ID token:', error);
                throw error
            });
    };

    async getEmailForGithubUser(entraIdToken: string, githubUser: string): Promise<string> {
        const getRequestOptions: RequestInit = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + entraIdToken,
            }
        }
        return fetch("http://localhost:8080/api/securityChampion/workMail?gitHubUser=" + githubUser, getRequestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status.toString());
                }
                return response.text()
            })
            .then(email => {
                return email.replace('@', '_')
            })
            .catch(error => {
                console.error('An error occurred when fetching email from Sikkerhetsmetrikker:', error);
                throw error
            });
    }

    async preProcessEntity(
        entity: Entity,
    ): Promise<Entity> {
        const spec = entity.spec
        if (entity.kind === 'Group' && spec && spec.type === "security_champion") {
            const entraIDToken = await this.getEntraIDToken(
                this.config.getConfig("catalog.providers.microsoftGraphOrg.default"),
                this.config.getConfig("catalog.providers.microsoftGraphOrg.default")
            )
            const members = spec.members
            if (members && Array.isArray(members) && members.length > 0 && typeof members[0] === 'string') {
                const githubUser: string = members[0]
                const email = await this.getEmailForGithubUser(entraIDToken, githubUser)
                spec.members = [email]
                return entity
            }
        }
        return entity
    }
}