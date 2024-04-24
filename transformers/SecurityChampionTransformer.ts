import { Transformer, TransformerOptions } from '@backstage/transformer-common';
import { Entity } from '@backstage/catalog-model';

export default class GroupTransformer implements Transformer {
    constructor(private readonly options?: TransformerOptions) {}

    async transform(entity: Entity): Promise<Entity> {
        if (entity.spec.type === 'security_champion') {
            const entraIDBody = {
                grant_type: "client_credentials",
                client_id: "",
                client_secret: "",
                scope: "/.default"
            }
            
            const postRequestOptions: RequestInit = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(entraIDBody).toString()
            }
            
            fetch('https://login.microsoftonline.com/7f74c8a2-43ce-46b2-b0e8-b6306cba73a3/oauth2/v2.0/token', postRequestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.status.toString());
                    }
                    return response.json()
                })
                .then(body => {
                    fetch('http://sikkerhetsmetrikker.dev.skip.statkart.no/api/securityChampion/workMail?gitHubUser='+entity.spec.members[0])
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(response.status.toString());
                            }
                            return response.text()
                        })
                        .then(text => {
                            entity.spec.members = [text.replace('@', '_')]
                            return entity
                        })
                        .catch(error => {
                            console.error("Error occured when retrieving oauth2-token from Entra ID.")
                        })
                })
        }
    }
}