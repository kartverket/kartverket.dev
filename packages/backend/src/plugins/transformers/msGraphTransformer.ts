import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {GroupEntity, GroupEntityV1alpha1} from '@backstage/catalog-model';
import {defaultGroupTransformer} from "@backstage/plugin-catalog-backend-module-msgraph";

export async function msGraphGroupTransformer(
    group: MicrosoftGraph.Group,
    groupPhoto?: string,
): Promise<GroupEntity | undefined> {
    if (group.displayName?.includes('_leads')) {
        return undefined;
    }
    let groupType = group.displayName?.split(' - ')[2];

    if (group.displayName?.toLowerCase().includes('aad - tf')) {
        group.displayName = group.displayName.split(' - ').slice(3).join(' - ');
    }

    let groupEntity: GroupEntityV1alpha1 | undefined = await defaultGroupTransformer(group, groupPhoto);

    if (groupEntity === undefined) {
        return undefined;
    }

    if (groupType === undefined) {
        return groupEntity;
    }

    if (groupType.toLowerCase().includes("role")) {
        groupType = group.displayName?.split(' - ')[1];
    }

    if (groupType === undefined) {
        return groupEntity;
    }

    if (groupType.toLowerCase().includes('product owner')) {
        groupEntity.spec.type = 'product owner';
    }
    if (groupType.toLowerCase().includes('tech lead')) {
        groupEntity.spec.type = 'tech lead';
    }
    if (groupType.toLowerCase().includes('team lead')) {
        groupEntity.spec.type = 'team lead';
    }
    if (groupType.toLowerCase().includes('business unit')) {
        groupEntity.spec.type = 'business unit';
    }
    if (groupType.toLowerCase().includes('product area')) {
        groupEntity.spec.type = 'product area';
    }

    return groupEntity;
}