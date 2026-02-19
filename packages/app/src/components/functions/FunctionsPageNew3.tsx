import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { FunctionsPageNew2 } from './FunctionsPageNew2';

type RootEntityNamesType = {
  kind: string;
  namespace: string;
  name: string;
};



export const FunctionsPageNew3 = () => {
  const [rootEntity, setRootEntity] = useState<RootEntityNamesType[]>([]);
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(functionPageTranslationRef);

  useEffect(() => {
    catalogApi.getEntities({ filter: { kind: 'function' } }).then(response => {
      const filteredResponse = response.items.filter(item =>
        item.metadata.name === 'rootfunction' ? item : null,
      );
      setRootEntity(
        filteredResponse.map(item => ({
          kind: item.kind,
          namespace: item.metadata.namespace || 'default',
          name: item.metadata.name,
        })),
      );
    });
  }, [catalogApi]);

  const rootEnt = { kind: "Function", namespace: "default", name:"rootfunction"}
  const rootEnt2 = ['function:default/rootfunction']

  return (
    <>
      <CatalogGraphPage
          rootEntityNames={rootEnt}
          initialState={{
            selectedKinds: ['function'],
            rootEntityRefs: rootEnt2,
            maxDepth:1
          }}
        />
        <FunctionsPageNew2/>
    </>
      
  );
};
