import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GroupEntity } from '@backstage/catalog-model';
import {defaultGroupTransformer} from "@backstage/plugin-catalog-backend-module-msgraph";

export async function msGraphGroupTransformer(
    group: MicrosoftGraph.Group,
    groupPhoto?: string,
): Promise<GroupEntity | undefined> {
    if (group.displayName?.includes('_leads')) {
        return undefined;
    }
    if (group.displayName?.toLowerCase().includes('cloud_sk_team')) {
        group.displayName = group.displayName!.split('_').slice(3).join('_');
    }
    return await defaultGroupTransformer(group, groupPhoto);
}