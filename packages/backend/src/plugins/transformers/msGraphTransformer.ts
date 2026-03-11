import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GroupEntity, GroupEntityV1alpha1 } from '@backstage/catalog-model';
import { defaultGroupTransformer } from '@backstage/plugin-catalog-backend-module-msgraph';

const PREFIXED_GROUP_TYPES = ['business unit', 'product area'];

function toCatalogGroupDisplayName(
  displayName?: string | null,
): string | null | undefined {
  if (!displayName) {
    return displayName;
  }

  const parts = displayName.split(' - ');
  if (
    parts.length < 3 ||
    parts[0]?.toLowerCase() !== 'aad' ||
    parts[1]?.toLowerCase() !== 'tf'
  ) {
    return displayName;
  }

  const type = parts[2]?.toLowerCase();
  // Business unit and product area get a type prefix in the slug to avoid
  // collisions with other group types that may share the same leaf name.
  if (type !== undefined && PREFIXED_GROUP_TYPES.includes(type)) {
    return parts.slice(2).join(' - ');
  }

  return parts.slice(3).join(' - ');
}

export async function msGraphGroupTransformer(
  group: MicrosoftGraph.Group,
  groupPhoto?: string,
): Promise<GroupEntity | undefined> {
  if (group.displayName?.includes('_leads')) {
    return undefined;
  }
  const groupType = group.displayName?.split(' - ')[2];
  const catalogDisplayName = toCatalogGroupDisplayName(group.displayName);
  const transformedGroup =
    catalogDisplayName === group.displayName
      ? group
      : { ...group, displayName: catalogDisplayName };

  const groupEntity: GroupEntityV1alpha1 | undefined =
    await defaultGroupTransformer(transformedGroup, groupPhoto);

  if (groupEntity === undefined) {
    return undefined;
  }
  if (groupType !== undefined && groupType.toLowerCase().includes('role')) {
    groupEntity.spec.type = 'role';
  }
  if (
    groupType !== undefined &&
    groupType.toLowerCase().includes('business unit')
  ) {
    groupEntity.spec.type = 'business unit';
  }
  if (
    groupType !== undefined &&
    groupType.toLowerCase().includes('product area')
  ) {
    groupEntity.spec.type = 'product area';
  }

  // For group types that have a type prefix in the slug (to ensure uniqueness),
  // restore the clean leaf name for UI display so users see "My BU" not "BUSINESS UNIT - My BU".
  if (
    groupType !== undefined &&
    PREFIXED_GROUP_TYPES.includes(groupType.toLowerCase())
  ) {
    const cleanName = group.displayName?.split(' - ').slice(3).join(' - ');
    if (cleanName) {
      groupEntity.metadata.title = cleanName;
      groupEntity.spec.profile ??= {};
      groupEntity.spec.profile.displayName = cleanName;
    }
  }

  return groupEntity;
}
