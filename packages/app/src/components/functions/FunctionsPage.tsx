import { Grid } from '@material-ui/core';
import {
    CatalogTable,
} from '@backstage/plugin-catalog';
import { Content, Header, Page } from '@backstage/core-components';
import { EntityKindPicker, EntityListProvider } from '@backstage/plugin-catalog-react';


export const FunctionsPage = () => {

    return (
        <Page themeId="functions">
            <Header title="Funksjoner" />
            <Content>
                <EntityListProvider >
                <Grid container spacing={3} alignItems="stretch">
                    <EntityKindPicker initialFilter='function' hidden />
                    <CatalogTable />
                </Grid>
                </EntityListProvider>
            </Content>
        </Page>
    );
}