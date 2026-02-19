import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';
import { Content, Header, Page, Table, TableColumn } from '@backstage/core-components';
import { Card, CardContent, Typography } from '@material-ui/core';
import { FunctionEntityV1alpha1 } from '@internal/plugin-function-kind-common';
import { RELATION_CHILD_OF } from '@backstage/catalog-model';

type EntityData = {
  kind: string;
  namespace: string;
  name: string;
  fullName?: string;
  parent?: string;
  children?: FunctionEntityV1alpha1[];
};

const findParent = (entity: FunctionEntityV1alpha1): string => {
  const childOfRelation = entity.relations?.find(it => it.type === RELATION_CHILD_OF)
  if (childOfRelation){
    return childOfRelation.targetRef
  }
  return ""
}

export const FunctionsPageNew22 = () => {
  const [rootEntity, setRootEntity] = useState<EntityData[]>([]);
  const [funcEntities, setFuncEntity] = useState<EntityData[]>([]);
  const [funcMap, setFuncMap] = useState<Map<String,FunctionEntityV1alpha1[]>>(new Map());
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(functionPageTranslationRef);

  useEffect(() => {
    catalogApi.getEntities({ filter: { kind: 'function' } }).then(response => {
      const functions = response.items as FunctionEntityV1alpha1[]
      console.log(functions[0])
      const grouped1 = Map.groupBy(functions, findParent)
      console.log(grouped1)      
      setFuncMap(grouped1)

      setFuncEntity(functions.map(item => ({
        kind: item.kind,
        namespace: item.metadata.namespace || 'default',
        name: item.metadata.name,
        fullName: `${item.kind.toLowerCase()}:${item.metadata.namespace}/${item.metadata.name}`,
        parent: item.spec.parentFunction,
        children: grouped1.get(`${item.kind.toLowerCase()}:${item.metadata.namespace}/${item.metadata.name}`)
      })));
      
      const filteredResponse = response.items.filter(item =>
        item.metadata.name === 'rootfunction' ? item : null,
      );
      setRootEntity(
        filteredResponse.map(item => ({
          kind: item.kind,
          namespace: item.metadata.namespace || 'default',
          name: item.metadata.name,
          children: grouped1.get(`${item.kind.toLowerCase()}:${item.metadata.namespace}/${item.metadata.name}`)
        })));
    });
  }, [catalogApi]);

  const rootEnt = { kind: "Function", namespace: "default", name:"rootfunction"}
  const rootEnt2 = ['function:default/rootfunction']

  const columns: TableColumn<FunctionEntityV1alpha1>[] = [
    { id: 'name', title: 'Name', field: 'name' },
    { id: 'parent', title: 'Parent', field:'parent' },
  ];

  console.log("yooo")
  console.log(funcEntities[1])
  console.log(funcEntities.filter(it => it.children))

  if(rootEntity.length === 0 || rootEntity[0].children === undefined || rootEntity[0].children.length === 0){
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
        <Table 
        options={{ pageSize: 10}}
        columns={columns} 
        data={rootEntity[0].children}
        detailPanel={ rowData => (
          "yo"
        )}
        />
      </Content>
      </Page>
  );
};
