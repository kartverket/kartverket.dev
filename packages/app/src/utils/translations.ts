import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';
import { catalogReactTranslationRef } from '@backstage/plugin-catalog-react/alpha';

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
    noRootTitle: 'No functions available',
    noRootDescription:
      'The root function or its children could not be found. Please check that function entities are registered in the catalog.',
    noSubFunctionsTitle: 'No sub-functions',
    noSubFunctionsDescription:
      'This function does not have any sub-functions registered yet.',
    exportCsvButton: 'Export to CSV',
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
          'functionpage.noRootTitle': 'Ingen funksjoner tilgjengelig',
          'functionpage.noRootDescription':
            'Rotfunksjonen eller dens barn ble ikke funnet. Sjekk at funksjonsentiteter er registrert i katalogen.',
          'functionpage.noSubFunctionsTitle': 'Ingen delfunksjoner',
          'functionpage.noSubFunctionsDescription':
            'Denne funksjonen har ingen delfunksjoner registrert ennå.',
          'functionpage.exportCsvButton': 'Eksporter til CSV',
        },
      }),
  },
});

const functionEntityPageMessages = {
  functionEntityPage: {
    graphTitle: 'Relations',
    aboutTitle: 'About the business function',
    editTitle: 'Edit',
    createSubFunctionTitle: 'Create new sub-function',
    overviewTitle: 'Overview',
  },
};

export const functionEntityPageTranslationRef = createTranslationRef({
  id: 'functionEntityPage',
  messages: functionEntityPageMessages,
});

export const functionEntityPageNorwegianTranslation = createTranslationResource(
  {
    ref: functionEntityPageTranslationRef,
    translations: {
      no: () =>
        Promise.resolve({
          default: {
            'functionEntityPage.graphTitle': 'Relasjoner',
            'functionEntityPage.aboutTitle': 'Om forretningsfunksjonen',
            'functionEntityPage.editTitle': 'Rediger',
            'functionEntityPage.createSubFunctionTitle': 'Lag ny delfunksjon',
            'functionEntityPage.overviewTitle': 'Oversikt',
          },
        }),
    },
  },
);

export const catalogNorwegianTranslation = createTranslationResource({
  ref: catalogTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'deleteEntity.description':
            'Denne entiteten er ikke referert av noen lokasjon og mottar dermed ikke oppdateringer. Klikk her for å slette.',
          'deleteEntity.cancelButtonTitle': 'Avbryt',
          'deleteEntity.deleteButtonTitle': 'Slett',
          'deleteEntity.dialogTitle':
            'Er du sikker på at du vil slette denne entiteten?',
          'deleteEntity.actionButtonTitle': 'Slett entitet',
          'indexPage.title': '{{orgName}} Katalog',
          'indexPage.createButtonTitle': 'Opprett',
          'indexPage.supportButtonContent':
            'Alle entitetene i programvarekatalogen din',
          'entityPage.notFoundMessage':
            'Det finnes ingen {{kind}} med forespurt {{link}}.',
          'entityPage.notFoundLinkText': 'type, navnerom og navn',
          'aboutCard.title': 'Om',
          'aboutCard.unknown': 'ukjent',
          'aboutCard.refreshButtonTitle': 'Planlegg oppdatering av entitet',
          'aboutCard.editButtonTitle': 'Rediger metadata',
          'aboutCard.editButtonAriaLabel': 'Rediger',
          'aboutCard.createSimilarButtonTitle': 'Opprett noe lignende',
          'aboutCard.refreshScheduledMessage': 'Oppdatering planlagt',
          'aboutCard.refreshButtonAriaLabel': 'Oppdater',
          'aboutCard.launchTemplate': 'Start mal',
          'aboutCard.viewTechdocs': 'Vis TechDocs',
          'aboutCard.viewSource': 'Vis kilde',
          'aboutCard.descriptionField.value': 'Ingen beskrivelse',
          'aboutCard.descriptionField.label': 'Beskrivelse',
          'aboutCard.ownerField.value': 'Ingen eier',
          'aboutCard.ownerField.label': 'Eier',
          'aboutCard.domainField.value': 'Inget domene',
          'aboutCard.domainField.label': 'Domene',
          'aboutCard.systemField.value': 'Inget system',
          'aboutCard.systemField.label': 'System',
          'aboutCard.parentComponentField.value': 'Ingen foreldrekomponent',
          'aboutCard.parentComponentField.label': 'Foreldrekomponent',
          'aboutCard.typeField.label': 'Type',
          'aboutCard.lifecycleField.label': 'Livssyklus',
          'aboutCard.tagsField.value': 'Ingen merkelapper',
          'aboutCard.tagsField.label': 'Merkelapper',
          'aboutCard.targetsField.label': 'Mål',
          'searchResultItem.type': 'Type',
          'searchResultItem.kind': 'Type',
          'searchResultItem.owner': 'Eier',
          'searchResultItem.lifecycle': 'Livssyklus',
          'catalogTable.allFilters': 'Alle',
          'catalogTable.warningPanelTitle':
            'Kunne ikke hente entiteter fra katalogen.',
          'catalogTable.viewActionTitle': 'Vis',
          'catalogTable.editActionTitle': 'Rediger',
          'catalogTable.starActionTitle': 'Legg til i favoritter',
          'catalogTable.unStarActionTitle': 'Fjern fra favoritter',
          'dependencyOfComponentsCard.title': 'Avhengighet til komponenter',
          'dependencyOfComponentsCard.emptyMessage':
            'Ingen komponenter er avhengig av denne komponenten',
          'dependsOnComponentsCard.title': 'Avhenger av komponenter',
          'dependsOnComponentsCard.emptyMessage':
            'Ingen komponent er en avhengighet til denne komponenten',
          'dependsOnResourcesCard.title': 'Avhenger av ressurser',
          'dependsOnResourcesCard.emptyMessage':
            'Ingen ressurs er en avhengighet til denne komponenten',
          'entityContextMenu.copiedMessage': 'Kopiert!',
          'entityContextMenu.moreButtonTitle': 'Mer',
          'entityContextMenu.inspectMenuTitle': 'Inspiser entitet',
          'entityContextMenu.copyURLMenuTitle': 'Kopier entitets-URL',
          'entityContextMenu.unregisterMenuTitle': 'Avregistrer entitet',
          'entityContextMenu.moreButtonAriaLabel': 'mer',
          'entityLabelsCard.title': 'Etiketter',
          'entityLabelsCard.readMoreButtonTitle': 'Les mer',
          'entityLabelsCard.emptyDescription':
            'Ingen etiketter er definert for denne entiteten. Du kan legge til etiketter i YAML-filen din som vist i det uthevede eksempelet nedenfor:',
          'entityLabels.ownerLabel': 'Eier',
          'entityLabels.warningPanelTitle': 'Entitet ikke funnet',
          'entityLabels.lifecycleLabel': 'Livssyklus',
          'entityLinksCard.title': 'Lenker',
          'entityLinksCard.readMoreButtonTitle': 'Les mer',
          'entityLinksCard.emptyDescription':
            'Ingen lenker er definert for denne entiteten. Du kan legge til lenker i YAML-filen din som vist i det uthevede eksempelet nedenfor:',
          'entityNotFound.title': 'Entitet ble ikke funnet',
          'entityNotFound.description':
            'Vil du bidra? Se i vår kom-i-gang-dokumentasjon.',
          'entityNotFound.docButtonTitle': 'DOKUMENTASJON',
          'entityTabs.tabsAriaLabel': 'Faner',
          entityProcessingErrorsDescription: 'Feilen nedenfor stammer fra',
          entityRelationWarningDescription:
            'Denne entiteten har relasjoner til andre entiteter som ikke finnes i katalogen.\n Entiteter som ikke ble funnet: ',
          'hasComponentsCard.title': 'Har komponenter',
          'hasComponentsCard.emptyMessage':
            'Ingen komponent er en del av dette systemet',
          'hasResourcesCard.title': 'Har ressurser',
          'hasResourcesCard.emptyMessage':
            'Ingen ressurs er en del av dette systemet',
          'hasSubcomponentsCard.title': 'Har underkomponenter',
          'hasSubcomponentsCard.emptyMessage':
            'Ingen underkomponent er en del av denne komponenten',
          'hasSubdomainsCard.title': 'Har underdomener',
          'hasSubdomainsCard.emptyMessage':
            'Inget underdomene er en del av dette domenet',
          'hasSystemsCard.title': 'Har systemer',
          'hasSystemsCard.emptyMessage':
            'Inget system er en del av dette domenet',
          'relatedEntitiesCard.emptyHelpLinkTitle':
            'Lær hvordan du endrer dette',
          'systemDiagramCard.title': 'Systemdiagram',
          'systemDiagramCard.description':
            'Bruk klyping og zoom for å navigere i diagrammet.',
          'systemDiagramCard.edgeLabels.dependsOn': 'avhenger av',
          'systemDiagramCard.edgeLabels.partOf': 'del av',
          'systemDiagramCard.edgeLabels.provides': 'tilbyr',
        },
      }),
  },
});

export const catalogReactNorwegianTranslation = createTranslationResource({
  ref: catalogReactTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'catalogFilter.title': 'Filtre',
          'catalogFilter.buttonTitle': 'Filtre',
          'entityKindPicker.title': 'Kind',
          'entityKindPicker.errorMessage': 'Klarte ikke å laste entitetskinds',
          'entityLifecyclePicker.title': 'Livssyklus',
          'entityNamespacePicker.title': 'Namespace',
          'entityOwnerPicker.title': 'Eier',
          'entityProcessingStatusPicker.title': 'Prosesseringsstatus',
          'entityTagPicker.title': 'Merkelapper',
          'entityPeekAheadPopover.title':
            'Se alle merkelapper for denne entiteten.',
          'entityPeekAheadPopover.entityCardActionsAriaLabel': 'Vis',
          'entityPeekAheadPopover.entityCardActionsTitle': 'Vis detaljer',
          'entityPeekAheadPopover.emailCardAction.title': 'E-post {{email}}',
          'entityPeekAheadPopover.emailCardAction.ariaLabel': 'E-post',
          'entityPeekAheadPopover.emailCardAction.subTitle': 'mailto {{email}}',
          'entitySearchBar.placeholder': 'Søk',
          'entityTypePicker.title': 'Type',
          'entityTypePicker.errorMessage': 'Klarte ikke å laste entitetstyper',
          'entityTypePicker.optionAllTitle': 'alle',
          'favoriteEntity.addToFavorites': 'Legg til i favoritter',
          'favoriteEntity.removeFromFavorites': 'Fjern fra favoritter',
          'inspectEntityDialog.title': 'Entitetsinspektør',
          'inspectEntityDialog.closeButtonTitle': 'Lukk',
          'inspectEntityDialog.tabsAriaLabel': 'Inspektøralternativer',
          'inspectEntityDialog.ancestryPage.title': 'Opphav',
          'inspectEntityDialog.ancestryPage.description':
            'Dette er opphavet til entiteter over den gjeldende – det vil si kjeden(e) av entiteter ned til den gjeldende, der {{processorsLink}} underordnede entiteter som til slutt førte til at den gjeldende eksisterer. Merk at dette er en helt annen mekanisme enn relasjoner.',
          'inspectEntityDialog.ancestryPage.processorsLink':
            'prosessorer sendte',
          'inspectEntityDialog.colocatedPage.title': 'Samlokalisert',
          'inspectEntityDialog.colocatedPage.description':
            'Dette er entitetene som er samlokalisert med denne entiteten – det vil si at de stammer fra samme datakilde (f.eks. samme YAML-fil), eller fra samme opphav (f.eks. den opprinnelig registrerte URL-en).',
          'inspectEntityDialog.colocatedPage.alertNoLocation':
            'Entiteten hadde ingen lokasjonsinformasjon.',
          'inspectEntityDialog.colocatedPage.alertNoEntity':
            'Det var ingen andre entiteter på denne lokasjonen.',
          'inspectEntityDialog.colocatedPage.locationHeader':
            'På samme lokasjon',
          'inspectEntityDialog.colocatedPage.originHeader': 'Fra samme opphav',
          'inspectEntityDialog.jsonPage.title': 'Entitet som JSON',
          'inspectEntityDialog.jsonPage.description':
            'Dette er rå entitetsdata fra katalogen, i JSON-format.',
          'inspectEntityDialog.overviewPage.title': 'Oversikt',
          'inspectEntityDialog.overviewPage.metadata.title': 'Metadata',
          'inspectEntityDialog.overviewPage.labels': 'Etiketter',
          'inspectEntityDialog.overviewPage.status.title': 'Status',
          'inspectEntityDialog.overviewPage.identity.title': 'Identitet',
          'inspectEntityDialog.overviewPage.annotations': 'Merknader',
          'inspectEntityDialog.overviewPage.tags': 'Merkelapper',
          'inspectEntityDialog.overviewPage.relation.title': 'Relasjoner',
          'inspectEntityDialog.yamlPage.title': 'Entitet som YAML',
          'inspectEntityDialog.yamlPage.description':
            'Dette er rå entitetsdata fra katalogen, i YAML-format.',
          'inspectEntityDialog.tabNames.json': 'Rå JSON',
          'inspectEntityDialog.tabNames.yaml': 'Rå YAML',
          'inspectEntityDialog.tabNames.overview': 'Oversikt',
          'inspectEntityDialog.tabNames.ancestry': 'Opphav',
          'inspectEntityDialog.tabNames.colocated': 'Samlokalisert',
          'unregisterEntityDialog.title':
            'Er du sikker på at du vil avregistrere denne entiteten?',
          'unregisterEntityDialog.cancelButtonTitle': 'Avbryt',
          'unregisterEntityDialog.deleteButtonTitle': 'Slett entitet',
          'unregisterEntityDialog.deleteEntitySuccessMessage':
            'Fjernet entitet {{entityName}}',
          'unregisterEntityDialog.onlyDeleteStateTitle':
            'Denne entiteten ser ikke ut til å stamme fra en registrert lokasjon. Du har derfor bare muligheten til å slette den direkte fra katalogen.',
          'unregisterEntityDialog.errorStateTitle':
            'Intern feil: ukjent tilstand',
          'unregisterEntityDialog.bootstrapState.title':
            'Du kan ikke avregistrere denne entiteten siden den stammer fra en beskyttet Backstage-konfigurasjon (lokasjon "{{location}}"). Kontakt {{appTitle}}-integratoren hvis du mener dette er feil.',
          'unregisterEntityDialog.bootstrapState.advancedDescription':
            'Du har muligheten til å slette selve entiteten fra katalogen. Merk at dette bare bør gjøres hvis du vet at katalogfilen er slettet fra, eller flyttet fra, sin opprinnelige lokasjon. Hvis ikke vil entiteten dukke opp igjen ved neste oppdateringsrunde.',
          'unregisterEntityDialog.bootstrapState.advancedOptions':
            'Avanserte alternativer',
          'unregisterEntityDialog.unregisterState.title':
            'Denne handlingen vil avregistrere følgende entiteter:',
          'unregisterEntityDialog.unregisterState.description':
            'For å angre, registrer entiteten på nytt i {{appTitle}}.',
          'unregisterEntityDialog.unregisterState.subTitle':
            'Plassert på følgende lokasjon:',
          'unregisterEntityDialog.unregisterState.advancedDescription':
            'Du har også muligheten til å slette selve entiteten fra katalogen. Merk at dette bare bør gjøres hvis du vet at katalogfilen er slettet fra, eller flyttet fra, sin opprinnelige lokasjon. Hvis ikke vil entiteten dukke opp igjen ved neste oppdateringsrunde.',
          'unregisterEntityDialog.unregisterState.advancedOptions':
            'Avanserte alternativer',
          'unregisterEntityDialog.unregisterState.unregisterButtonTitle':
            'Avregistrer lokasjon',
          'userListPicker.defaultOrgName': 'Bedrift',
          'userListPicker.orgFilterAllLabel': 'Alle',
          'userListPicker.personalFilter.title': 'Personlig',
          'userListPicker.personalFilter.ownedLabel': 'Eide',
          'userListPicker.personalFilter.starredLabel': 'Stjernemerket',
          'entityTableColumnTitle.name': 'Navn',
          'entityTableColumnTitle.type': 'Type',
          'entityTableColumnTitle.label': 'Etikett',
          'entityTableColumnTitle.title': 'Tittel',
          'entityTableColumnTitle.description': 'Beskrivelse',
          'entityTableColumnTitle.system': 'System',
          'entityTableColumnTitle.namespace': 'Navnerom',
          'entityTableColumnTitle.domain': 'Domene',
          'entityTableColumnTitle.tags': 'Merkelapper',
          'entityTableColumnTitle.owner': 'Eier',
          'entityTableColumnTitle.lifecycle': 'Livssyklus',
          'entityTableColumnTitle.targets': 'Mål',
          'missingAnnotationEmptyState.title': 'Manglende merknad',
          'missingAnnotationEmptyState.readMore': 'Les mer',
          'missingAnnotationEmptyState.annotationYaml':
            'Legg til merknaden i {{entityKind}} YAML-filen din som vist i det uthevede eksempelet nedenfor:',
          'missingAnnotationEmptyState.generateDescription_one':
            'Merknaden {{annotations}} mangler. Du må legge til merknaden i {{entityKind}} for å aktivere dette verktøyet.',
          'missingAnnotationEmptyState.generateDescription_other':
            'Merknadene {{annotations}} mangler. Du må legge til merknadene i {{entityKind}} for å aktivere dette verktøyet.',
        },
      }),
  },
});
