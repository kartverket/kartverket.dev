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
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import { UserSettingsSignInAvatar } from '@backstage/plugin-user-settings';
import { makeStyles } from 'tss-react/mui';
import EditIcon from '@mui/icons-material/Edit';
import AppsIcon from '@mui/icons-material/Apps';
import TreeIcon from '@mui/icons-material/AccountTree';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import SpeedIcon from '@mui/icons-material/Speed';
import LibraryBooks from '@mui/icons-material/LibraryBooks';
import { PropsWithChildren } from 'react';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { sidebarTranslationRef } from '../../utils/translations';
import { SidebarSearchModal } from '../search/SidebarSearchModal';
import SettingsIcon from '@mui/icons-material/Settings';

const useSidebarLogoStyles = makeStyles()(() => ({
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
}));

const SidebarLogo = () => {
  const { classes } = useSidebarLogoStyles();
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
        <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
        </SidebarGroup>
        <SidebarItem icon={HomeIcon} to="/" text={t('sidebar.homeTitle')} />

        <SidebarDivider />
        <SidebarGroup label="mygroup" icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          <MyGroupsSidebarItem
            singularTitle={t('sidebar.myGroupTitle')}
            pluralTitle={t('sidebar.myGroupsTitle')}
            icon={GroupIcon}
          />
          <SidebarItem
            icon={AppsIcon}
            to="catalog"
            text={t('sidebar.catalogTitle')}
          />
          <SidebarItem
            icon={TreeIcon}
            to="functions"
            text={t('sidebar.functionsTitle')}
          />
          <SidebarItem
            icon={EditIcon}
            to="catalog-creator"
            text={t('sidebar.editOrCreateTitle')}
          />
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
          label="Settings"
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
