import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import {
  CatalogTable,
  CatalogTableColumnsFunc,
} from '@backstage/plugin-catalog';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import {
  catalogApiRef,
  EntityKindPicker,
  EntityListProvider,
  FavoriteEntity,
} from '@backstage/plugin-catalog-react';
import { EntityRelationsGraph } from '@backstage/plugin-catalog-graph';
import { useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import { ButtonLink, Flex } from '@backstage/ui';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';

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
      {
        title: 'Favorite',
        sorting: false,
        align: 'right',
        render: row => <FavoriteEntity entity={row.entity} />,
      },
    ];
  }

  return CatalogTable.defaultColumnsFunc(entityListContext);
};

export const FunctionsPage = () => {
  const [rootEntity, setRootEntity] = useState<RootEntityNamesType[]>([]);
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(functionPageTranslationRef);

  const useStyles = makeStyles(theme => ({
    subtitle: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
  }));

  const classes = useStyles();

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

  const subtitleContent = (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2">{t('functionpage.subtitle')}</Typography>
      <Typography variant="body2" className={classes.subtitle}>
        {t('functionpage.subtitle2')}
      </Typography>
      <Typography variant="body2">
        <strong>{t('functionpage.structure')}</strong>{' '}
        {t('functionpage.structureDescription')}
      </Typography>
    </Box>
  );

  return (
    <Page themeId="functions">
      <Header title={t('functionpage.title')} subtitle={subtitleContent} />
      <Content>
        <Flex justify="end" style={{ marginBottom: '1rem' }}>
          <ButtonLink href="/catalog-creator-function">
            {t('functionpage.createButton')}
          </ButtonLink>
        </Flex>

        <EntityListProvider>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <EntityKindPicker initialFilter="function" hidden />
              <CatalogTable
                title={t('functionpage.catalogtableTitle')}
                columns={functionColumns}
                actions={[]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title={t('functionpage.graphTitle')}>
                <EntityRelationsGraph
                  rootEntityNames={rootEntity}
                  kinds={['function']}
                  maxDepth={1}
                />
              </InfoCard>
            </Grid>
          </Grid>
        </EntityListProvider>
      </Content>
    </Page>
  );
};
