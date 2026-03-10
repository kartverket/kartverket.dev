import {
  Content,
  EmptyState,
  Header,
  HeaderLabel,
  HeaderTabs,
  Page,
} from '@backstage/core-components';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';
import { FunctionEntityV1alpha1 } from '@internal/plugin-function-kind-common';
import { RELATION_CHILD_OF, parseEntityRef } from '@backstage/catalog-model';
import { Button, Flex } from '@backstage/ui';
import { FunctionTree } from './FunctionTree';
import { hasDescendantOwnedByAny } from './hasDescendantOwnedByAny';
import { EntityData } from './types';
import { exportFunctionsToCsv } from './exportCsv';

export type { EntityData } from './types';

const findParent = (entity: FunctionEntityV1alpha1): string => {
  const childOfRelation = entity.relations?.find(
    it => it.type === RELATION_CHILD_OF,
  );
  if (childOfRelation) {
    return childOfRelation.targetRef;
  }
  return '';
};

const ExportCsvButton = ({
  functions,
}: {
  functions: FunctionEntityV1alpha1[];
}) => {
  const { t } = useTranslationRef(functionPageTranslationRef);

  return (
    <Button
      onClick={() => exportFunctionsToCsv(functions)}
      variant="secondary"
      iconStart={<i className="ri-download-2-line" />}
    >
      {t('functionpage.exportCsvButton')}
    </Button>
  );
};

export const FunctionsPage = () => {
  const [rootEntity, setRootEntity] = useState<EntityData>();
  const [childfunctionsMap, setChildfunctionsMap] = useState<
    Map<string | undefined, EntityData[]>
  >(new Map());
  const [defaultExpanded, setDefaultExpanded] = useState<string[]>([]);
  const [level1Children, setLevel1Children] = useState<EntityData[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [allFunctions, setAllFunctions] = useState<FunctionEntityV1alpha1[]>(
    [],
  );
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const { t } = useTranslationRef(functionPageTranslationRef);

  useEffect(() => {
    Promise.all([
      catalogApi.getEntities({ filter: { kind: 'function' } }),
      identityApi.getBackstageIdentity(),
    ]).then(([response, identity]) => {
      const functions = response.items as FunctionEntityV1alpha1[];
      setAllFunctions(functions);

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

      for (const children of groupedFuncs.values()) {
        children.sort((a, b) => a.title.localeCompare(b.title, 'nb'));
      }

      setChildfunctionsMap(groupedFuncs);

      // Find and validate the root node(s) (no parent)
      const rootCandidates = funcs.filter(item => !item.parent);
      if (rootCandidates.length !== 1) {
        // eslint-disable-next-line no-console
        console.error(
          `Expected exactly one root function, but found ${rootCandidates.length}, named ${rootCandidates.map(it => it.name).join(', ')}.`,
        );
      }
      setRootEntity(rootCandidates[0]);

      // Derive level-1 children (direct children of root) for tabs
      const l1Children = rootCandidates[0]?.ref
        ? (groupedFuncs.get(rootCandidates[0].ref) ?? [])
        : [];
      setLevel1Children(l1Children);

      // Auto-select the first tab whose subtree is owned by the user's teams
      if (l1Children.length > 0 && userGroupNames.length > 0) {
        const ownedIndex = l1Children.findIndex(
          child =>
            child.ref &&
            hasDescendantOwnedByAny(child.ref, groupedFuncs, userGroupNames),
        );
        if (ownedIndex >= 0) {
          setSelectedTab(ownedIndex);
        }
      }

      // Auto-expand nodes that have descendants owned by the user's teams
      if (userGroupNames.length > 0) {
        const expandedIds = l1Children.flatMap(child => {
          const grandchildren = child.ref
            ? (groupedFuncs.get(child.ref) ?? [])
            : [];
          return grandchildren
            .filter(
              gc =>
                gc.ref &&
                hasDescendantOwnedByAny(gc.ref, groupedFuncs, userGroupNames),
            )
            .map(gc => gc.ref!)
            .filter(Boolean);
        });
        setDefaultExpanded(expandedIds);
      }
    });
  }, [catalogApi, identityApi]);

  if (
    rootEntity === undefined ||
    rootEntity.ref === undefined ||
    level1Children.length === 0
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

  const tabs = level1Children.map(child => ({
    id: child.ref ?? child.name,
    label: child.title,
  }));

  const activeChild = level1Children[selectedTab];

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
      <HeaderTabs
        tabs={tabs}
        selectedIndex={selectedTab}
        onChange={index => setSelectedTab(index)}
      />
      <Content>
        <Flex justify="end" style={{ marginBottom: '16px' }}>
          <ExportCsvButton functions={allFunctions} />
        </Flex>
        {activeChild?.ref &&
        (childfunctionsMap.get(activeChild.ref)?.length ?? 0) > 0 ? (
          <FunctionTree
            rootRef={activeChild.ref}
            funcMap={childfunctionsMap}
            defaultExpanded={defaultExpanded}
          />
        ) : (
          <EmptyState
            title={t('functionpage.noSubFunctionsTitle')}
            description={t('functionpage.noSubFunctionsDescription')}
            missing="data"
          />
        )}
      </Content>
    </Page>
  );
};
