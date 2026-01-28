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
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { Button } from '@backstage/ui';
import { getContext } from '../../utils/api';
import { getAuthenticationTokens } from '../../utils/authenticationUtils';

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
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

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

  async function getContextOnClick() {
    const { entraIdToken, backstageToken } = await getAuthenticationTokens(
      config,
      backstageAuthApi,
      microsoftAuthApi,
    );
    const url = new URL(
      `${config.getString('backend.baseUrl')}/api/regelrett-schemas/proxy/fetch-regelrett-form`,
    );
    url.searchParams.set('contextId', 'c74c477e-0516-449d-9f0f-4236543fde62');
    getContext(url, backstageToken, entraIdToken);
  }

  return (
    <Page themeId="functions">
      <Button onClick={() => getContextOnClick()}> Click me to test!</Button>
      <Header
        title="Forretningsfunksjoner i Kartverket"
        subtitle="Oversikt over hva Kartverket må kunne gjøre for å levere på sitt samfunnsoppdrag, og hvordan dette støttes av del-funksjoner, systemer og team."
      />
      <Content>
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
