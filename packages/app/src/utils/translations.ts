import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const sidebarMessages = {
  sidebar: {
    searchTitle: 'Search',
    homeTitle: 'Home',
    myGroupTitle: 'My group',
    editOrCreateTitle: 'Edit or Create',
    catalogTitle: 'Catalog',
    functionTitle: 'Functions',
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
          'sidebar.editOrCreateTitle': 'Rediger eller opprett',
          'sidebar.catalogTitle': 'Katalog',
          'sidebar.functionTitle': 'Funksjoner',
          'sidebar.docsTitle': 'Dokumentasjon',
          'sidebar.notificationsTitle': 'Varsler',
          'sidebar.settingsTitle': 'Innstillinger',
        },
      }),
  },
});
