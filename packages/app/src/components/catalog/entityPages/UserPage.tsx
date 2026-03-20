import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import {
  EntityUserProfileCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import { entityWarningContent } from './shared';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../../utils/translations';

export const UserPage = () => {
  const { t } = useTranslationRef(entityPageTabTranslationRef);

  return (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <Grid container spacing={3}>
          {entityWarningContent}
          <Grid item xs={12} md={6}>
            <EntityUserProfileCard variant="gridItem" />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityOwnershipCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>
    </EntityLayout>
  );
};
