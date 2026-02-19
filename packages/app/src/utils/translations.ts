import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const sidebarMessages = {
  sidebar: {
    searchTitle: 'Search',
    homeTitle: 'Home',
    myGroupTitle: 'My group',
    myGroupsTitle: 'My groups',
    editOrCreateTitle: 'Edit or Create',
    catalogTitle: 'Catalog',
    functionsTitle: 'Functions',
    docsTitle: 'Docs',
    notificationsTitle: 'Notifications',
    settingsTitle: 'Settings',
  },
};

export const sidebarTranslationRef = createTranslationRef({
  id: 'sidebar',
  messages: sidebarMessages,
});

export const sidebarNorwegianTranslation = createTranslationResource({
  ref: sidebarTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'sidebar.searchTitle': 'Søk',
          'sidebar.homeTitle': 'Hjem',
          'sidebar.myGroupTitle': 'Min gruppe',
          'sidebar.myGroupsTitle': 'Mine grupper',
          'sidebar.editOrCreateTitle': 'Rediger/opprett',
          'sidebar.catalogTitle': 'Katalog',
          'sidebar.functionsTitle': 'Funksjoner',
          'sidebar.docsTitle': 'Dokumentasjon',
          'sidebar.notificationsTitle': 'Varsler',
          'sidebar.settingsTitle': 'Innstillinger',
        },
      }),
  },
});

export const homepageMessages = {
  homepage: {
    recentlyVisited: 'Recently Visited',
    favorites: 'Favorites',
    toolkit: 'Toolkit',
  },
};

export const homepageTranslationRef = createTranslationRef({
  id: 'homepage',
  messages: homepageMessages,
});

export const homepageNorwegianTranslation = createTranslationResource({
  ref: homepageTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'homepage.recentlyVisited': 'Nylig besøkt',
          'homepage.favorites': 'Favoritter',
          'homepage.toolkit': 'Verktøysett',
        },
      }),
  },
});

export const functionPageMessages = {
  functionpage: {
    title: 'Business Functions in Kartverket',
    subtitle:
      'A business function describes what Kartverket must be able to do to deliver on its societal mission. Functions are composed of sub-functions that are supported by systems and delivered by teams.',
    structure: 'Structure:',
    structureDescription: 'Function → Sub-function → System',
    createButton: 'Create new function',
    catalogtableTitle: 'All Business Functions',
    graphTitle: 'Function hierarchy',
  },
};

export const functionPageTranslationRef = createTranslationRef({
  id: 'functionPage',
  messages: functionPageMessages,
});

export const functionPageNorwegianTranslation = createTranslationResource({
  ref: functionPageTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'functionpage.title': 'Forretningsfunksjoner i Kartverket',
          'functionpage.subtitle':
            'En forretningsfunksjon beskriver hva Kartverket må kunne gjøre for å levere på sitt samfunnsoppdrag. Funksjoner består av delfunksjoner som støttes av systemer og leveres av team.',
          'functionpage.structure': 'Struktur:',
          'functionpage.structureDescription':
            'Funksjon → Delfunksjon → System',
          'functionpage.createButton': 'Lag ny funksjon',
          'functionpage.catalogtableTitle': 'Alle forretningsfunksjoner',
          'functionpage.graphTitle': 'Funksjonshierarki',
        },
      }),
  },
});
