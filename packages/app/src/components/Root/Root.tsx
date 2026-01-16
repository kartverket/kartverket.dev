import {
  Link,
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  WarningIcon,
} from '@backstage/core-components';
import { FeatureFlagged } from '@backstage/core-app-api';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';

import { UserSettingsSignInAvatar } from '@backstage/plugin-user-settings';
import { makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CategoryIcon from '@material-ui/icons/Category';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import GroupIcon from '@material-ui/icons/People';
import SearchIcon from '@material-ui/icons/Search';
import SpeedIcon from '@material-ui/icons/Speed';
import SettingsIcon from '@material-ui/icons/Settings';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import { PropsWithChildren } from 'react';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { sidebarTranslationRef } from '../../utils/translations';
import { SidebarSearchModal } from '../search/SidebarSearchModal';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull type="light" /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const { t } = useTranslationRef(sidebarTranslationRef);
  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SidebarGroup icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
        </SidebarGroup>
        <SidebarItem icon={HomeIcon} to="/" text={t('sidebar.homeTitle')} />

        <SidebarDivider />
        <SidebarGroup label={t('sidebar.myGroupTitle')} icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          <MyGroupsSidebarItem
            singularTitle={t('sidebar.myGroupTitle')}
            pluralTitle="My Groups"
            icon={GroupIcon}
          />
          <SidebarItem
            icon={EditIcon}
            to="catalog-creator"
            text={t('sidebar.editOrCreateTitle')}
          />

          <SidebarItem
            icon={CategoryIcon}
            to="catalog"
            text={t('sidebar.catalogTitle')}
          />
          <FeatureFlagged with="show-functions-page">
            <SidebarItem
              icon={CategoryIcon}
              to="functions"
              text={t('sidebar.functionTitle')}
            />
          </FeatureFlagged>
          <SidebarItem
            icon={LibraryBooks}
            to="docs"
            text={t('sidebar.docsTitle')}
          />

          {/* End global nav */}
          <SidebarDivider />
          <SidebarScrollWrapper>
            <SidebarItem icon={SpeedIcon} to="lighthouse" text="Lighthouse" />
          </SidebarScrollWrapper>
          <SidebarItem icon={WarningIcon} to="opencost" text="SKIPcost" />
        </SidebarGroup>
        <SidebarSpace />
        <SidebarDivider />
        <NotificationsSidebarItem text={t('sidebar.notificationsTitle')} />
        <SidebarDivider />
        <SidebarGroup
          label={t('sidebar.settingsTitle')}
          icon={<UserSettingsSignInAvatar />}
          to="/settings"
        >
          {/* <SidebarSettings /> */}
          <SidebarItem
            icon={SettingsIcon}
            to="settings"
            text={t('sidebar.settingsTitle')}
          />
        </SidebarGroup>
      </Sidebar>
      {children}
    </SidebarPage>
  );
};
