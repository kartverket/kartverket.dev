import { Grid } from '@material-ui/core';
import {
  CatalogTable,
  CatalogTableColumnsFunc,
} from '@backstage/plugin-catalog';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import {
  catalogApiRef,
  EntityKindPicker,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { EntityRelationsGraph } from '@backstage/plugin-catalog-graph';
import { useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { ButtonLink, Flex } from '@backstage/ui';

type RootEntityNamesType = {
  kind: string;
  namespace: string;
  name: string;
};

const functionColumns: CatalogTableColumnsFunc = entityListContext => {
  if (entityListContext.filters.kind?.value === 'function') {
    return [
      CatalogTable.columns.createNameColumn({ defaultKind: 'function' }),
      CatalogTable.columns.createOwnerColumn(),
      CatalogTable.columns.createSpecTypeColumn(),
    ];
  }

  return CatalogTable.defaultColumnsFunc(entityListContext);
};

export const FunctionsPage = () => {
  const [rootEntity, setRootEntity] = useState<RootEntityNamesType[]>([]);
  const catalogApi = useApi(catalogApiRef);

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

  return (
    <Page themeId="functions">
      <Header
        title="Forretningsfunksjoner i Kartverket"
        subtitle="Oversikt over hva Kartverket må kunne gjøre for å levere på sitt samfunnsoppdrag, og hvordan dette støttes av del-funksjoner, systemer og team."
      />
      <Content>
        <Flex justify="end" style={{ marginBottom: '1rem' }}>
          <ButtonLink href="/catalog-creator-function">
            Create new function
          </ButtonLink>
        </Flex>

        <EntityListProvider>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <EntityKindPicker initialFilter="function" hidden />
              <CatalogTable
                title="Alle forretningsfunksjoner"
                columns={functionColumns}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title="Funksjonshierarki">
                <EntityRelationsGraph
                  rootEntityNames={rootEntity}
                  kinds={['function']}
                  maxDepth={2}
                />
              </InfoCard>
            </Grid>
          </Grid>
        </EntityListProvider>
      </Content>
    </Page>
  );
};
