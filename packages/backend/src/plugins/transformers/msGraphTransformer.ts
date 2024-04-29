import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {GroupEntity, GroupEntityV1alpha1} from '@backstage/catalog-model';
import {defaultGroupTransformer} from "@backstage/plugin-catalog-backend-module-msgraph";
import {PluginEnvironment} from "../../types";

export const msGraphGroupTransformer = (env: PluginEnvironment) =>
    async (
        group: MicrosoftGraph.Group,
        groupPhoto?: string,
): Promise<GroupEntity | undefined> => {
    if (group.displayName?.includes('_leads')) {
        return undefined;
    }

    const entraIdCredentialsConfig = env.config.getConfig('catalog.providers.microsoftGraphOrg.default')
    console.log(entraIdCredentialsConfig.getString('clientId'))
    console.log(entraIdCredentialsConfig.getString('clientSecret'))

    let groupType = group.displayName?.split(' - ')[2];

    if (group.displayName?.toLowerCase().includes('aad - tf')) {
        group.displayName = group.displayName.split(' - ').slice(3).join(' - ');
    }

    let groupEntity: GroupEntityV1alpha1 | undefined = await defaultGroupTransformer(group, groupPhoto);

    if (groupEntity === undefined) {
        return undefined;
    }
    if (groupType != undefined && groupType.toLowerCase().includes('role')) {
        groupEntity.spec.type = 'role';
    }
    if (groupType != undefined && groupType.toLowerCase().includes('business unit')) {
        groupEntity.spec.type = 'business unit';
    }
    if (groupType != undefined && groupType.toLowerCase().includes('product area')) {
        groupEntity.spec.type = 'product area';
    }

    return groupEntity;
}