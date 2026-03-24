import { useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CachedIcon from '@material-ui/icons/Cached';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Alert from '@material-ui/lab/Alert';

import { InfoCard, InfoCardVariants, Link } from '@backstage/core-components';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  stringifyEntityRef,
  RELATION_PARENT_OF,
  RELATION_CHILD_OF,
  ANNOTATION_LOCATION,
  ANNOTATION_EDIT_URL,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  useEntity,
  getEntityRelations,
  EntityRefLinks,
} from '@backstage/plugin-catalog-react';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import { catalogEntityRefreshPermission } from '@backstage/plugin-catalog-common/alpha';

import { groupProfileCardTranslationRef } from './translation';

export type GroupProfileCardProps = {
  variant?: InfoCardVariants;
  showLinks?: boolean;
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
  list: {
    padding: 0,
    marginLeft: theme.spacing(0.5),
  },
  infoBanner: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}));

const CardTitle = (props: { title: string }) => (
  <Box display="flex" alignItems="center">
    <GroupIcon fontSize="inherit" />
    <Box ml={1}>{props.title}</Box>
  </Box>
);

export const GroupProfileCard = (props: GroupProfileCardProps) => {
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const { entity: group } = useEntity();
  const { allowed: canRefresh } = useEntityPermission(
    catalogEntityRefreshPermission,
  );
  const { t } = useTranslationRef(groupProfileCardTranslationRef);
  const classes = useStyles();

  const refreshEntity = useCallback(async () => {
    await catalogApi.refreshEntity(stringifyEntityRef(group));
    alertApi.post({
      message: t('groupProfileCard.refreshConfirmationMessage'),
      severity: 'info',
      display: 'transient',
    });
  }, [catalogApi, alertApi, group, t]);

  if (!group) {
    return (
      <Alert severity="error">{t('groupProfileCard.groupNotFound')}</Alert>
    );
  }

  const {
    metadata: { name, description, annotations },
    spec,
  } = group;

  const profile = (
    spec as {
      profile?: { displayName?: string; email?: string; picture?: string };
    }
  )?.profile;
  const title = group.metadata.title;

  const childRelations = getEntityRelations(group, RELATION_PARENT_OF, {
    kind: 'group',
  });
  const parentRelations = getEntityRelations(group, RELATION_CHILD_OF, {
    kind: 'group',
  });

  const entityLocation = annotations?.[ANNOTATION_LOCATION];
  const allowRefresh =
    entityLocation?.startsWith('url:') || entityLocation?.startsWith('file:');
  const entityMetadataEditUrl = annotations?.[ANNOTATION_EDIT_URL];
  const displayName = profile?.displayName ?? title ?? name;
  const emailHref = profile?.email ? `mailto:${profile.email}` : '#';

  const infoCardAction = entityMetadataEditUrl ? (
    <IconButton
      aria-label={t('groupProfileCard.editIconButtonTitle')}
      title={t('groupProfileCard.editIconButtonTitle')}
      component={Link}
      to={entityMetadataEditUrl}
    >
      <EditIcon />
    </IconButton>
  ) : (
    <IconButton
      aria-label={t('groupProfileCard.editIconButtonTitle')}
      disabled
      title={t('groupProfileCard.editIconButtonTitle')}
    >
      <EditIcon />
    </IconButton>
  );

  return (
    <InfoCard
      title={<CardTitle title={displayName} />}
      subheader={description}
      variant={props.variant}
      action={
        <>
          {allowRefresh && canRefresh && (
            <IconButton
              aria-label={t('groupProfileCard.refreshIconButtonAriaLabel')}
              title={t('groupProfileCard.refreshIconButtonTitle')}
              onClick={refreshEntity}
            >
              <CachedIcon />
            </IconButton>
          )}
          {infoCardAction}
        </>
      }
    >
      <Box className={classes.container}>
        <Alert severity="info" className={classes.infoBanner}>
          {t('groupProfileCard.infoBanner')}
        </Alert>

        <List className={classes.list}>
          <ListItem>
            <ListItemIcon>
              <Tooltip title={t('groupProfileCard.listItemTitle.entityRef')}>
                <PermIdentityIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={stringifyEntityRef(group)}
              secondary={t('groupProfileCard.listItemTitle.entityRef')}
            />
          </ListItem>

          {profile?.email && (
            <ListItem>
              <ListItemIcon>
                <Tooltip title={t('groupProfileCard.listItemTitle.email')}>
                  <EmailIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={<Link to={emailHref}>{profile.email}</Link>}
                secondary={t('groupProfileCard.listItemTitle.email')}
              />
            </ListItem>
          )}

          <ListItem>
            <ListItemIcon>
              <Tooltip title={t('groupProfileCard.listItemTitle.parentGroup')}>
                <AccountTreeIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={
                parentRelations.length ? (
                  <EntityRefLinks
                    entityRefs={parentRelations}
                    defaultKind="Group"
                  />
                ) : (
                  t('groupProfileCard.notAvailable')
                )
              }
              secondary={t('groupProfileCard.listItemTitle.parentGroup')}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Tooltip title={t('groupProfileCard.listItemTitle.childGroups')}>
                <GroupIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={
                childRelations.length ? (
                  <EntityRefLinks
                    entityRefs={childRelations}
                    defaultKind="Group"
                  />
                ) : (
                  t('groupProfileCard.notAvailable')
                )
              }
              secondary={t('groupProfileCard.listItemTitle.childGroups')}
            />
          </ListItem>
        </List>
      </Box>
    </InfoCard>
  );
};
