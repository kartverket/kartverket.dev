import { Grid } from '@material-ui/core';
import {
    CatalogTable,
    CatalogTableColumnsFunc
} from '@backstage/plugin-catalog';
import { Content, Header, Page } from '@backstage/core-components';
import { catalogApiRef, EntityKindPicker, EntityListProvider } from '@backstage/plugin-catalog-react';
import { EntityRelationsGraph } from '@backstage/plugin-catalog-graph';
import { useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';

type RootEntityNamesType = {
    kind: string;
    namespace: string;
    name: string;
}

export const FunctionsPage = () => {
    const [coreFunctionEntities, setCoreFunctionEntities] = useState<RootEntityNamesType[]>([]);
    const catalogApi = useApi(catalogApiRef);

    useEffect(() => {
        catalogApi.getEntities({ filter: { kind: 'function' } })
            .then(response => {
                const filteredResponse = response.items.filter(item => item.spec?.type === 'core-function' ? item : null);
                setCoreFunctionEntities(filteredResponse.map(item => ({
                    kind: item.kind,
                    namespace: item.metadata.namespace || 'default',
                    name: item.metadata.name,
                })));
            })
            .catch(error => console.error('Error:', error));
    }, [catalogApi]);

    return (
        <Page themeId="functions">
            <Header title="Forretningsfunksjoner i Kartverket" subtitle="Oversikt over hva Kartverket må kunne gjøre for å levere på sitt samfunnsoppdrag, og hvordan dette støttes av del-funksjoner, systemer og team." />
            <Content>
                <EntityListProvider >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <EntityKindPicker initialFilter='function' hidden />
                            <CatalogTable columns={functionColumns} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <EntityRelationsGraph rootEntityNames={coreFunctionEntities} kinds={['function']} />
                        </Grid>
                    </Grid>
                </EntityListProvider>
            </Content>
        </Page>
    );
}

const functionColumns: CatalogTableColumnsFunc = entityListContext => {
    if (entityListContext.filters.kind?.value === 'function') {
        return [
            CatalogTable.columns.createNameColumn(),
            CatalogTable.columns.createOwnerColumn(),
            CatalogTable.columns.createSpecTypeColumn()
        ];
    }

    return CatalogTable.defaultColumnsFunc(entityListContext);
};
