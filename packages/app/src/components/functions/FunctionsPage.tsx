import {
  Content,
  EmptyState,
  Header,
  HeaderLabel,
  Page,
} from '@backstage/core-components';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';
import { FunctionEntityV1alpha1 } from '@internal/plugin-function-kind-common';
import { RELATION_CHILD_OF, parseEntityRef } from '@backstage/catalog-model';
import { FunctionTree } from './FunctionTree';

export type EntityData = {
  kind: string;
  namespace: string;
  title: string;
  name: string;
  ref?: string;
  parent?: string;
  owner?: string;
};

const findParent = (entity: FunctionEntityV1alpha1): string => {
  const childOfRelation = entity.relations?.find(
    it => it.type === RELATION_CHILD_OF,
  );
  if (childOfRelation) {
    return childOfRelation.targetRef;
  }
  return '';
};

/** Check if a node or any of its descendants is owned by any of the given teams */
const hasDescendantOwnedByAny = (
  nodeRef: string,
  funcMap: Map<string | undefined, EntityData[]>,
  teamNames: string[],
): boolean => {
  const children = funcMap.get(nodeRef) ?? [];
  return children.some(
    child =>
      teamNames.some(team =>
        child.owner?.toLowerCase().includes(team.toLowerCase()),
      ) ||
      (child.ref !== undefined &&
        hasDescendantOwnedByAny(child.ref, funcMap, teamNames)),
  );
};

export const FunctionsPage = () => {
  const [rootEntity, setRootEntity] = useState<EntityData>();
  const [childfunctionsMap, setChildfunctionsMap] = useState<
    Map<string | undefined, EntityData[]>
  >(new Map());
  const [defaultExpanded, setDefaultExpanded] = useState<string[]>([]);
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const { t } = useTranslationRef(functionPageTranslationRef);

  useEffect(() => {
    Promise.all([
      catalogApi.getEntities({ filter: { kind: 'function' } }),
      identityApi.getBackstageIdentity(),
    ]).then(([response, identity]) => {
      const functions = response.items as FunctionEntityV1alpha1[];

      // Extract group names from ownership refs (e.g. "group:default/skvis" → "skvis")
      const userGroupNames = identity.ownershipEntityRefs
        .filter(ref => ref.startsWith('group:'))
        .map(ref => parseEntityRef(ref).name);

      const funcs = functions.map(item => {
        const ns = (item.metadata.namespace || 'default').toLowerCase();
        const name = item.metadata.name.toLowerCase();
        return {
          kind: item.kind,
          namespace: ns,
          title: item.metadata.title ?? item.metadata.name,
          name: name,
          ref: `${item.kind.toLowerCase()}:${ns}/${name}`,
          parent: findParent(item),
          owner: item.spec.owner,
        };
      });

      const groupedFuncs = funcs.reduce((acc, func) => {
        const key = func.parent;
        const existing = acc.get(key) ?? [];
        existing.push(func);
        acc.set(key, existing);
        return acc;
      }, new Map<string | undefined, EntityData[]>());

      setChildfunctionsMap(groupedFuncs);
      // Find the root node (no parent)
      const root = funcs.find(item => !item.parent);
      setRootEntity(root);

      // Find and validate the root node(s) (no parent)
      const rootCandidates = funcs.filter(item => !item.parent);
      if (rootCandidates.length !== 1) {
        // eslint-disable-next-line no-console
        console.error(
          `Expected exactly one root function, but found ${rootCandidates.length}, named ${rootCandidates.map(it => it.name).join(', ')}.`,
        );
      }
      setRootEntity(rootCandidates[0]);

      // Auto-expand level-1 nodes that have descendants owned by the user's teams
      if (root?.ref && userGroupNames.length > 0) {
        const level1Children = groupedFuncs.get(root.ref) ?? [];
        const expandedIds = level1Children
          .filter(
            child =>
              child.ref &&
              hasDescendantOwnedByAny(child.ref, groupedFuncs, userGroupNames),
          )
          .map(child => child.ref!)
          .filter(Boolean);
        setDefaultExpanded(expandedIds);
      }
    });
  }, [catalogApi, identityApi]);

  if (
    rootEntity === undefined ||
    rootEntity.ref === undefined ||
    childfunctionsMap.get(rootEntity.ref)?.length === 0
  ) {
    return (
      <Page themeId="functions">
        <Header
          title={t('functionpage.title')}
          subtitle={t('functionpage.subtitle')}
        >
          <HeaderLabel
            label={t('functionpage.structure')}
            value={t('functionpage.structureDescription')}
          />
        </Header>
        <Content>
          <EmptyState
            title={t('functionpage.noRootTitle')}
            description={t('functionpage.noRootDescription')}
            missing="data"
          />
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="functions">
      <Header
        title={t('functionpage.title')}
        subtitle={t('functionpage.subtitle')}
      >
        <HeaderLabel
          label={t('functionpage.structure')}
          value={t('functionpage.structureDescription')}
        />
      </Header>
      <Content>
        <FunctionTree
          rootRef={rootEntity.ref}
          funcMap={childfunctionsMap}
          defaultExpanded={defaultExpanded}
        />
      </Content>
    </Page>
  );
};
