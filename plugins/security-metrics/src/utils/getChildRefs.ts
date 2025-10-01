import { Entity } from '@backstage/catalog-model';

export const getChildRefs = (entities: Entity[]): string[] => {
  return entities.flatMap(
    entity =>
      entity.relations
        ?.filter(
          rel =>
            rel.type === 'ownerOf' ||
            rel.type === 'hasPart' ||
            rel.type === 'parentOf' ||
            rel.type === 'dependsOn',
        )
        .flatMap(rel => rel.targetRef) ?? [],
  );
};
