import React from 'react';
import {
  HomePageToolkit,
  HomePageCompanyLogo,
  HomePageStarredEntities,
  TemplateBackstageLogoIcon,
} from '@backstage/plugin-home';
import { Content, Page } from '@backstage/core-components';
import { HomePageSearchBar } from '@backstage/plugin-search';
import {
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { Grid, makeStyles } from '@material-ui/core';
import { StatusCard } from "@internal/plugin-instatus";
import LogoFull from '../Root/LogoFull';

const useStyles = makeStyles(theme => ({
  searchBarInput: {
    maxWidth: '60vw',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
  },
  searchBarOutline: {
    borderStyle: 'none'
  }
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

export const HomePage = () => {
  const classes = useStyles();
  const { svg, path, container } = useLogoStyles();

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo
              className={container}
              logo={<LogoFull className={`${svg} ${path}`} />}
            />
            <Grid container item xs={12} justifyContent='center'>
              <HomePageSearchBar
                InputProps={{ classes: { root: classes.searchBarInput, notchedOutline: classes.searchBarOutline }}}
                placeholder="Search"
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit
                  tools={[{
                    url: 'https://monitoring.kartverket.dev',
                    label: 'Grafana',
                    icon: <TemplateBackstageLogoIcon />,
                  }, {
                    url: 'https://console.cloud.google.com',
                    label: 'Google Cloud',
                    icon: <TemplateBackstageLogoIcon />,
                  }, {
                    url: 'https://github.com/kartverket',
                    label: 'GitHub',
                    icon: <TemplateBackstageLogoIcon />,
                  }]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StatusCard pageId='skip' reportUrl="https://kartverketgroup.slack.com/archives/C028ZEED280" />
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
