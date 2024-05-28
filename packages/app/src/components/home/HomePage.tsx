import React, { useEffect, useState } from 'react';
import {
  HomePageToolkit,
  HomePageCompanyLogo,
  HomePageTopVisited,
  HomePageRecentlyVisited,
} from '@backstage/plugin-home';
import { Content, Page } from '@backstage/core-components';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import { Grid, makeStyles } from '@material-ui/core';
import { StatusCard } from '@internal/plugin-instatus';
import { XkcdComicCard } from 'backstage-plugin-xkcd';
import { useTheme } from '@material-ui/core/styles';
import LogoFull from '../Root/LogoFull';
import grafanaLogo from './logos/Grafana.png';
import argoLogo from './logos/Argo.png';
import sysdigLogo from './logos/Sysdig.png';
import googleCloudLogo from './logos/GoogleCloud.png';
import googleLogo from './logos/Google.png';
import databricksLogo from './logos/Databricks.png';
import githubLogo from './logos/Github.png';
import daskLogo from './logos/DASK.png';
import skipLogo from './logos/SKIP.png';
import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import Cookies = require('js-cookie');
import { jwtDecode } from 'jwt-decode';

const useStyles = makeStyles(theme => ({
  searchBarInput: {
    maxWidth: '60vw',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
  },
  searchBarOutline: {
    borderStyle: 'none',
  },
}));

const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(0, 5),
    width: '100%',
    maxWidth: 600,
  },
  svg: {
    width: '100%',
    height: 'auto',
  },
  path: {
    fill: '#7df3e1',
  },
}));

type GroupEntitySpec = {
  parent: string;
  profile: {
    displayName: string;
  };
  children: string[];
};

type UserEntitySpec = {
  profile: {
    email: string;
  };
  memberOf: string[];
};

export const HomePage = () => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  
  const { svg, path, container } = useLogoStyles();
  const theme = useTheme();
  const mode = theme.palette.type === 'dark' ? 'light' : 'dark';
  // TODO: DASK WILL DELETE AFTER DEBUGGING
  function getBearerToken() {
    const cookie = Cookies.get('https://kartverket.dev');
    if (cookie) {
      try {
        const tokenData = JSON.parse(cookie);
        const bearerToken = tokenData.BearerToken;
        if (bearerToken) {
          console.log('Bearer Token:', bearerToken);
          return bearerToken;
        } else {
          console.log('Bearer Token not found');
          return null;
        }
      } catch (error) {
        console.error('Failed to parse cookie:', error);
        return null;
      }
    } else {
      console.log('Cookie not found');
      return null;
    }
  }
  
  function decodeToken(token) {
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded Token:', decoded);
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  const [bearerToken, setBearerToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const token = getBearerToken();
    if (token) {
      setBearerToken(token);
      const decoded = decodeToken(token);
      setDecodedToken(decoded);
      console.log(decoded)
    }
  }, []);

  async function getGroups() {
    const catalogGroups = await catalogApi.getEntities({filter: {
      'kind':'Group',
    }});
    const catalogSpec = catalogGroups.items.map((entity) => ({
      entity: entity,
      spec: entity.spec as GroupEntitySpec,
    }));
    const relevantGroups = catalogSpec.filter((entity) => entity?.spec?.children?.length > 0 && entity?.spec?.profile?.displayName !== undefined && entity?.spec?.parent !== undefined);
    const areaGroupMap = relevantGroups.map((group) => {
      return {
        area: group.spec.parent.split('/')[1],
        groups: group.spec.profile.displayName,
      };
    });
    console.log(areaGroupMap)
  }

  async function getUsers() {
    const catalogUsers = await catalogApi.getEntities({filter: {
      'kind':'User',
    }});
    const userSpec = catalogUsers.items.map((entity) => ({
      entity: entity,
      spec: entity.spec as UserEntitySpec,
    }));
    const relevantUsers = userSpec.filter((entity) => entity?.spec?.profile?.email !== undefined && entity?.spec?.memberOf !== undefined);
    const userGroupMap = relevantUsers.map((user) => {
      return {
        user: user.spec.profile.email,
        groups: user.spec.memberOf.map((team) => team.split('/')[1]?.split('_')[0]),
      };
    });
    console.log(userGroupMap)
  }

  useEffect(() => {
    getGroups();
    getUsers();
  }, []);
  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo
              className={container}
              logo={<LogoFull type={mode} className={`${svg} ${path}`} />}
            />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar
                InputProps={{
                  classes: {
                    root: classes.searchBarInput,
                    notchedOutline: classes.searchBarOutline,
                  },
                }}
                placeholder="Search"
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageRecentlyVisited />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageTopVisited />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <HomePageToolkit
                tools={[
                  {
                    url: 'https://monitoring.kartverket.dev',
                    label: 'Grafana',
                    icon: (
                      <img src={grafanaLogo} alt="Logo of Grafana" width={35} />
                    ),
                  },
                  {
                    url: 'https://argo.kartverket.dev',
                    label: 'Argo CD',
                    icon: (
                      <img src={argoLogo} alt="Logo of Argo CD" width={45} />
                    ),
                  },
                  {
                    url: 'https://eu1.app.sysdig.com/api/saml/kartverket?redirectRoute=/&product=SDS&companyName=kartverket',
                    label: 'Sysdig Secure',
                    icon: (
                        <img src={sysdigLogo} alt="Logo of Sysdig" width={40} />
                    ),
                  },
                  {
                    url: 'https://accounts.gcp.databricks.com',
                    label: 'Databricks',
                    icon: (
                      <img
                        src={databricksLogo}
                        alt="Logo of Databricks"
                        width={35}
                      />
                    ),
                  },
                  {
                    url: 'https://console.cloud.google.com',
                    label: 'Google Cloud',
                    icon: (
                      <img
                        src={googleCloudLogo}
                        alt="Logo of Google"
                        width={35}
                      />
                    ),
                  },
                  {
                    url: 'https://github.com/kartverket',
                    label: 'GitHub',
                    icon: (
                      <img src={githubLogo} alt="Logo of GitHub" width={35} />
                    ),
                  },
                  {
                    url: 'https://jit.skip.kartverket.no',
                    label: 'JIT',
                    icon: (
                      <img src={googleLogo} alt="Logo of Google" width={35} />
                    ),
                  },
                  {
                    url: 'https://kartverket.atlassian.net/wiki/spaces/DAT/overview?homepageId=490045441',
                    label: 'DASK Docs',
                    icon: <img src={daskLogo} alt="Logo of DASK" width={35} />,
                  },
                  {
                    url: 'https://kartverket.atlassian.net/wiki/spaces/SKIPDOK/overview',
                    label: 'SKIP Docs',
                    icon: <img src={skipLogo} alt="Logo of SKIP" width={35} />,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatusCard
                pageId="skip"
                reportUrl="https://kartverketgroup.slack.com/archives/C028ZEED280"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <XkcdComicCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <iframe
                title="Powered by Fedifeed"
                allowFullScreen
                sandbox="allow-top-navigation allow-scripts"
                src="https://fedifeed.com/api/v1/feed?user=kv_plattform&instance=https%3A%2F%2Fmastodon.social&instance_type=&theme=auto-dark&size=100&header=true&replies=true&boosts=true"
                style={{
                  border: '0px',
                  overflow: 'hidden',
                  width: '100%',
                  height: '100%',
                  minHeight: '400px',
                }}
              />
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
