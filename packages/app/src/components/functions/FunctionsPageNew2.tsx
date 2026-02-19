import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';
import { Content, Header, Page, TableColumn } from '@backstage/core-components';
import { FunctionEntityV1alpha1 } from '@internal/plugin-function-kind-common';
import { RELATION_CHILD_OF } from '@backstage/catalog-model';
import { RecursiveTable } from './RecursiveTable';

export type EntityData = {
  kind: string;
  namespace: string;
  name: string;
  ref?: string;
  parent?: string;
};

const findParent = (entity: FunctionEntityV1alpha1): string => {
  const childOfRelation = entity.relations?.find(it => it.type === RELATION_CHILD_OF)
  if (childOfRelation){
    return childOfRelation.targetRef
  }
  return ""
}

export const FunctionsPageNew2 = () => {
  const [rootEntity, setRootEntity] = useState<EntityData>();
  const [funcMap, setFuncMap] = useState<Map<String,EntityData[]>>(new Map());
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(functionPageTranslationRef);

  useEffect(() => {
    catalogApi.getEntities({ filter: { kind: 'function' } }).then(response => {
      const functions = response.items as FunctionEntityV1alpha1[]

      const funcs = functions.map(item => ({
        kind: item.kind,
        namespace: item.metadata.namespace || 'default',
        name: item.metadata.name,
        ref: `${item.kind.toLowerCase()}:${item.metadata.namespace}/${item.metadata.name}`,
        parent: findParent(item),
      }))

      const groupedFuncs = Map.groupBy(funcs, f => f.parent)

      setFuncMap(groupedFuncs)
      setRootEntity(funcs.find(item =>
        item.name === 'rootfunction' ? item : null,
      ));
    });
  }, [catalogApi]);


  const columns: TableColumn<EntityData>[] = [
    { id: 'name', title: 'Name', field: 'name' },
    { id: 'parent', title: 'Parent', field:'parent' },
  ];


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
        <RecursiveTable
        columns={columns}
        children={funcMap.get(rootEntity.ref) ?? []}
        all={funcMap}
        />
      </Content>
      </Page>
  );
};
