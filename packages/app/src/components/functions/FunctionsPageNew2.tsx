import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';
import { Content, Header, Page } from '@backstage/core-components';
import { FunctionEntityV1alpha1 } from '@internal/plugin-function-kind-common';
import { RELATION_CHILD_OF } from '@backstage/catalog-model';
import { FunctionTree } from './FunctionTree';

export type EntityData = {
  kind: string;
  namespace: string;
  name: string;
  ref?: string;
  parent?: string;
  owner?: string;
};

const findParent = (entity: FunctionEntityV1alpha1): string => {
  const childOfRelation = entity.relations?.find(it => it.type === RELATION_CHILD_OF)
  if (childOfRelation){
    return childOfRelation.targetRef
  }
  return ""
}

/** Check if a node or any of its descendants is owned by the given team */
const hasDescendantOwnedBy = (
  nodeRef: string,
  funcMap: Map<String, EntityData[]>,
  teamId: string,
): boolean => {
  const children = funcMap.get(nodeRef) ?? [];
  return children.some(
    child =>
      child.owner?.toLowerCase().includes(teamId.toLowerCase()) ||
      // eslint-disable-next-line eqeqeq
      (child.ref != null && hasDescendantOwnedBy(child.ref, funcMap, teamId)),
  );
};

export const FunctionsPageNew2 = () => {
  const [rootEntity, setRootEntity] = useState<EntityData>();
  const [funcMap, setFuncMap] = useState<Map<String,EntityData[]>>(new Map());
  const [defaultExpanded, setDefaultExpanded] = useState<string[]>([]);
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(functionPageTranslationRef);
  const teamId = 'SKVIS';

  useEffect(() => {
    catalogApi.getEntities({ filter: { kind: 'function' } }).then(response => {
      const functions = response.items as FunctionEntityV1alpha1[]

      const funcs = functions.map(item => ({
        kind: item.kind,
        namespace: item.metadata.namespace || 'default',
        name: item.metadata.name,
        ref: `${item.kind.toLowerCase()}:${item.metadata.namespace}/${item.metadata.name}`,
        parent: findParent(item),
        owner: item.spec.owner,
      }))

      const groupedFuncs = Map.groupBy(funcs, f => f.parent)

      setFuncMap(groupedFuncs)
      // Find the root node (no parent)
      const root = funcs.find(item => !item.parent);
      setRootEntity(root);

      // Auto-expand level-1 nodes that have descendants owned by the team
      if (root?.ref) {
        const level1Children = groupedFuncs.get(root.ref) ?? [];
        const expandedIds = level1Children
          .filter(child => child.ref && hasDescendantOwnedBy(child.ref, groupedFuncs, teamId))
          .map(child => child.ref!)
          .filter(Boolean);
        setDefaultExpanded(expandedIds);
      }
    });
  }, [catalogApi]);


  if(rootEntity === undefined || rootEntity.ref === undefined || funcMap.get(rootEntity.ref)?.length === 0){
    return (
            <Page themeId="functions">
              Mangler enten rotfunksjon eller barn til roten.
            </Page>
    )
  }

  return (
      <Page themeId="functions">
      <Header title={t('functionpage.title')} />
      <Content>
        <FunctionTree
          rootRef={rootEntity.ref}
          funcMap={funcMap}
          defaultExpanded={defaultExpanded}
        />
      </Content>
      </Page>
  );
};
