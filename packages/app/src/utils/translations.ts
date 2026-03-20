import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';
import { catalogReactTranslationRef } from '@backstage/plugin-catalog-react/alpha';
import { orgTranslationRef } from '@backstage/plugin-org/alpha';
import { scaffolderTranslationRef } from '@backstage/plugin-scaffolder/alpha';
import { catalogGraphTranslationRef } from '@backstage/plugin-catalog-graph/alpha';
import { searchTranslationRef } from '@backstage/plugin-search/alpha';
import { homeTranslationRef } from '@backstage/plugin-home/alpha';
import { userSettingsTranslationRef } from '@backstage/plugin-user-settings/alpha';
import { notificationsTranslationRef } from '@backstage/plugin-notifications/alpha';
import { coreComponentsTranslationRef } from '@backstage/core-components/alpha';

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
    searchPlaceholder: 'Search',
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
          'homepage.searchPlaceholder': 'Søk',
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
    expiredSecurityForm: 'Expired security form',
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
          'functionpage.expiredSecurityForm': 'Utgått sikkerhetsskjema',
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
    criticalityLabel: 'Criticality',
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
            'functionEntityPage.criticalityLabel': 'Kritikalitet',
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
            'Det er ingen referanser til denne entiteten og den kan dermed slettes',
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
          'entityPage.notFoundLinkText': 'Kind, namespace og navn',
          'aboutCard.title': 'Om',
          'aboutCard.unknown': 'ukjent',
          'aboutCard.refreshButtonTitle': 'Planlegg oppdatering av entitet',
          'aboutCard.editButtonTitle': 'Rediger metadata',
          'aboutCard.editButtonAriaLabel': 'Rediger',
          'aboutCard.createSimilarButtonTitle': 'Opprett basert på kopi',
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
          'catalogTable.allFilters': null,
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
            'Denne komponenten har ingen avhengigheter til ressurser',
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
          'userListPicker.personalFilter.starredLabel': 'Stjernemerkede',
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

// --- Entity page tab titles ---

const entityPageTabMessages = {
  entityPageTab: {
    overview: 'Overview',
    edit: 'Edit',
    cicd: 'CI/CD',
    api: 'API',
    dependencies: 'Dependencies',
    docs: 'Docs',
    lighthouse: 'Lighthouse',
    diagram: 'Diagram',
    definition: 'Definition',
    functions: 'Functions',
    risc: 'Kodenær RoS',
    securityMetrics: 'Sikkerhetsmetrikker',
  },
};

export const entityPageTabTranslationRef = createTranslationRef({
  id: 'entityPageTab',
  messages: entityPageTabMessages,
});

export const entityPageTabNorwegianTranslation = createTranslationResource({
  ref: entityPageTabTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'entityPageTab.overview': 'Oversikt',
          'entityPageTab.edit': 'Rediger',
          'entityPageTab.cicd': 'CI/CD',
          'entityPageTab.api': 'API',
          'entityPageTab.dependencies': 'Avhengigheter',
          'entityPageTab.docs': 'Dokumentasjon',
          'entityPageTab.lighthouse': 'Lighthouse',
          'entityPageTab.diagram': 'Diagram',
          'entityPageTab.definition': 'Definisjon',
          'entityPageTab.functions': 'Funksjoner',
          'entityPageTab.risc': 'Kodenær RoS',
          'entityPageTab.securityMetrics': 'Sikkerhetsmetrikker',
        },
      }),
  },
});

// --- Search page ---

const searchPageMessages = {
  searchPage: {
    title: 'Search',
    resultType: 'Result Type',
    softwareCatalog: 'Software Catalog',
    documentation: 'Documentation',
    entityLabel: 'Entity',
    kindLabel: 'Kind',
    lifecycleLabel: 'Lifecycle',
  },
};

export const searchPageTranslationRef = createTranslationRef({
  id: 'searchPage',
  messages: searchPageMessages,
});

export const searchPageNorwegianTranslation = createTranslationResource({
  ref: searchPageTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'searchPage.title': 'Søk',
          'searchPage.resultType': 'Resultattype',
          'searchPage.softwareCatalog': 'Programvarekatalog',
          'searchPage.documentation': 'Dokumentasjon',
          'searchPage.entityLabel': 'Entitet',
          'searchPage.kindLabel': 'Kind',
          'searchPage.lifecycleLabel': 'Livssyklus',
        },
      }),
  },
});

// --- Shared component strings ---

const sharedComponentMessages = {
  shared: {
    cicdEmptyTitle: 'No CI/CD available for this entity',
    cicdEmptyDescription:
      'You need to add an annotation to your component if you want to enable CI/CD for it. You can read more about annotations in Backstage by clicking the button below.',
    cicdReadMore: 'Read more',
    functionsCardTitle: 'Functions',
  },
};

export const sharedComponentTranslationRef = createTranslationRef({
  id: 'sharedComponent',
  messages: sharedComponentMessages,
});

export const sharedComponentNorwegianTranslation = createTranslationResource({
  ref: sharedComponentTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'shared.cicdEmptyTitle':
            'Ingen CI/CD tilgjengelig for denne entiteten',
          'shared.cicdEmptyDescription':
            'Du må legge til en merknad i komponenten din for å aktivere CI/CD. Du kan lese mer om merknader i Backstage ved å klikke på knappen nedenfor.',
          'shared.cicdReadMore': 'Les mer',
          'shared.functionsCardTitle': 'Funksjoner',
        },
      }),
  },
});

// --- Backstage plugin translation overrides ---

export const orgNorwegianTranslation = createTranslationResource({
  ref: orgTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'groupProfileCard.groupNotFound': 'Gruppe ikke funnet',
          'groupProfileCard.editIconButtonTitle': 'Rediger metadata',
          'groupProfileCard.refreshIconButtonTitle':
            'Planlegg oppdatering av entitet',
          'groupProfileCard.refreshIconButtonAriaLabel': 'Oppdater',
          'groupProfileCard.listItemTitle.entityRef': 'Entitetsreferanse',
          'groupProfileCard.listItemTitle.email': 'E-post',
          'groupProfileCard.listItemTitle.parentGroup': 'Overordnet gruppe',
          'groupProfileCard.listItemTitle.childGroups': 'Undergrupper',
          'membersListCard.title': 'Medlemmer',
          'membersListCard.subtitle': 'i {{groupName}}',
          'membersListCard.paginationLabel': ', side {{page}} av {{nbPages}}',
          'membersListCard.noMembersDescription':
            'Denne gruppen har ingen medlemmer.',
          'membersListCard.aggregateMembersToggle.directMembers':
            'Direkte medlemmer',
          'membersListCard.aggregateMembersToggle.aggregatedMembers':
            'Aggregerte medlemmer',
          'membersListCard.aggregateMembersToggle.ariaLabel':
            'Brukertype-bryter',
          'ownershipCard.title': 'Eierskap',
          'ownershipCard.aggregateRelationsToggle.directRelations':
            'Direkte relasjoner',
          'ownershipCard.aggregateRelationsToggle.aggregatedRelations':
            'Aggregerte relasjoner',
          'ownershipCard.aggregateRelationsToggle.ariaLabel':
            'Eierskapstype-bryter',
          'userProfileCard.userNotFound': 'Bruker ikke funnet',
          'userProfileCard.editIconButtonTitle': 'Rediger metadata',
          'userProfileCard.listItemTitle.email': 'E-post',
          'userProfileCard.listItemTitle.memberOf': 'Medlem av',
          'userProfileCard.moreGroupButtonTitle': '...Flere ({{number}})',
          'userProfileCard.allGroupDialog.title': 'Alle gruppene til {{name}}:',
          'userProfileCard.allGroupDialog.closeButtonTitle': 'Lukk',
        },
      }),
  },
});

export const scaffolderNorwegianTranslation = createTranslationResource({
  ref: scaffolderTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'aboutCard.launchTemplate': 'Start mal',
          'actionsPage.title': 'Installerte handlinger',
          'actionsPage.pageTitle': 'Opprett en ny komponent',
          'actionsPage.subtitle':
            'Dette er samlingen av alle installerte handlinger',
          'actionsPage.content.emptyState.title': 'Ingen informasjon å vise',
          'actionsPage.content.emptyState.description':
            'Det er ingen handlinger installert, eller det oppstod et problem med kommunikasjonen til backend.',
          'actionsPage.content.searchFieldPlaceholder': 'Søk etter en handling',
          'actionsPage.action.input': 'Inndata',
          'actionsPage.action.output': 'Utdata',
          'actionsPage.action.examples': 'Eksempler',
          'fields.entityNamePicker.title': 'Navn',
          'fields.entityNamePicker.description': 'Unikt navn på komponenten',
          'fields.entityPicker.title': 'Entitet',
          'fields.entityPicker.description': 'En entitet fra katalogen',
          'fields.entityTagsPicker.title': 'Merkelapper',
          'fields.entityTagsPicker.description':
            "Legg til relevante merkelapper, trykk 'Enter' for å legge til nye. Gyldig format: [a-z0-9+#] separert med [-], maks 63 tegn",
          'fields.multiEntityPicker.title': 'Entitet',
          'fields.multiEntityPicker.description': 'En entitet fra katalogen',
          'fields.myGroupsPicker.title': 'Entitet',
          'fields.myGroupsPicker.description': 'En entitet fra katalogen',
          'fields.ownedEntityPicker.title': 'Entitet',
          'fields.ownedEntityPicker.description': 'En entitet fra katalogen',
          'fields.ownerPicker.title': 'Eier',
          'fields.ownerPicker.description': 'Eieren av komponenten',
          'fields.repoUrlPicker.host.title': 'Vert',
          'fields.repoUrlPicker.host.description':
            'Verten der repositoriet vil bli opprettet',
          'fields.repoUrlPicker.repository.title': 'Tilgjengelige repositorier',
          'fields.repoUrlPicker.repository.inputTitle': 'Repositorium',
          'fields.repoUrlPicker.repository.description':
            'Navnet på repositoriet',
          'fields.githubRepoPicker.owner.title': 'Tilgjengelige eiere',
          'fields.githubRepoPicker.owner.inputTitle': 'Eier',
          'fields.githubRepoPicker.owner.description':
            'Organisasjonen, brukeren eller prosjektet som dette repositoriet tilhører',
          'listTaskPage.title': 'Liste over maloppgaver',
          'listTaskPage.pageTitle': 'Maloppgaver',
          'listTaskPage.subtitle': 'Alle oppgaver som har blitt startet',
          'listTaskPage.content.emptyState.title': 'Ingen informasjon å vise',
          'listTaskPage.content.emptyState.description':
            'Det finnes ingen oppgaver, eller det oppstod et problem med kommunikasjonen til backend.',
          'listTaskPage.content.tableTitle': 'Oppgaver',
          'listTaskPage.content.tableCell.taskID': 'Oppgave-ID',
          'listTaskPage.content.tableCell.template': 'Mal',
          'listTaskPage.content.tableCell.created': 'Opprettet',
          'listTaskPage.content.tableCell.owner': 'Eier',
          'listTaskPage.content.tableCell.status': 'Status',
          'ownerListPicker.title': 'Oppgaveeier',
          'ownerListPicker.options.owned': 'Eide',
          'ownerListPicker.options.all': 'Alle',
          'ongoingTask.title': 'Kjøring av',
          'ongoingTask.pageTitle.hasTemplateName':
            'Kjøring av {{templateName}}',
          'ongoingTask.pageTitle.noTemplateName': 'Scaffolder-kjøring',
          'ongoingTask.subtitle': 'Oppgave {{taskId}}',
          'ongoingTask.cancelButtonTitle': 'Avbryt',
          'ongoingTask.retryButtonTitle': 'Prøv igjen',
          'ongoingTask.startOverButtonTitle': 'Start på nytt',
          'ongoingTask.hideLogsButtonTitle': 'Skjul logger',
          'ongoingTask.showLogsButtonTitle': 'Vis logger',
          'ongoingTask.contextMenu.hideLogs': 'Skjul logger',
          'ongoingTask.contextMenu.showLogs': 'Vis logger',
          'ongoingTask.contextMenu.hideButtonBar': 'Skjul knapperad',
          'ongoingTask.contextMenu.retry': 'Prøv igjen',
          'ongoingTask.contextMenu.showButtonBar': 'Vis knapperad',
          'ongoingTask.contextMenu.startOver': 'Start på nytt',
          'ongoingTask.contextMenu.cancel': 'Avbryt',
          'templateTypePicker.title': 'Kategorier',
          'templateListPage.title': 'Opprett en ny komponent',
          'templateListPage.subtitle':
            'Opprett nye programvarekomponenter ved hjelp av standardmaler i organisasjonen din',
          'templateListPage.pageTitle': 'Opprett en ny komponent',
          'templateListPage.templateGroups.defaultTitle': 'Maler',
          'templateListPage.templateGroups.otherTitle': 'Andre maler',
          'templateListPage.contentHeader.registerExistingButtonTitle':
            'Registrer eksisterende komponent',
          'templateListPage.contentHeader.supportButtonTitle':
            'Opprett nye programvarekomponenter ved hjelp av standardmaler. Ulike maler oppretter ulike typer komponenter (tjenester, nettsteder, dokumentasjon, ...).',
          'templateListPage.additionalLinksForEntity.viewTechDocsTitle':
            'Vis TechDocs',
          'templateWizardPage.title': 'Opprett en ny komponent',
          'templateWizardPage.subtitle':
            'Opprett nye programvarekomponenter ved hjelp av standardmaler i organisasjonen din',
          'templateWizardPage.pageTitle': 'Opprett en ny komponent',
          'templateWizardPage.templateWithTitle':
            'Opprett ny {{templateTitle}}',
          'templateWizardPage.pageContextMenu.editConfigurationTitle':
            'Rediger konfigurasjon',
          'fields.azureRepoPicker.organization.title': null,
          'fields.azureRepoPicker.organization.description': null,
          'fields.azureRepoPicker.project.title': null,
          'fields.azureRepoPicker.project.description': null,
          'fields.bitbucketRepoPicker.workspaces.title': null,
          'fields.bitbucketRepoPicker.workspaces.inputTitle': null,
          'fields.bitbucketRepoPicker.workspaces.description': null,
          'fields.bitbucketRepoPicker.project.title': null,
          'fields.bitbucketRepoPicker.project.inputTitle': null,
          'fields.bitbucketRepoPicker.project.description': null,
          'fields.gerritRepoPicker.owner.title': null,
          'fields.gerritRepoPicker.owner.description': null,
          'fields.gerritRepoPicker.parent.title': null,
          'fields.gerritRepoPicker.parent.description': null,
          'fields.giteaRepoPicker.owner.title': null,
          'fields.giteaRepoPicker.owner.inputTitle': null,
          'fields.giteaRepoPicker.owner.description': null,
          'fields.gitlabRepoPicker.owner.title': null,
          'fields.gitlabRepoPicker.owner.inputTitle': null,
          'fields.gitlabRepoPicker.owner.description': null,
          'fields.repoOwnerPicker.title': 'Eier',
          'fields.repoOwnerPicker.description': 'Eieren av repositoriet',
          'renderSchema.tableCell.name': 'Navn',
          'renderSchema.tableCell.title': 'Tittel',
          'renderSchema.tableCell.description': 'Beskrivelse',
          'renderSchema.tableCell.type': 'Type',
          'renderSchema.undefined': 'Ingen skjema definert',
          'templateEditorForm.stepper.emptyText':
            'Det er ingen spec-parametere i malen å forhåndsvise.',
          'templatingExtensions.title': 'Malfunksjoner',
          'templatingExtensions.pageTitle': 'Malfunksjoner',
          'templatingExtensions.subtitle':
            'Dette er samlingen av tilgjengelige malfunksjoner',
          'templatingExtensions.content.emptyState.title':
            'Ingen informasjon å vise',
          'templatingExtensions.content.emptyState.description':
            'Det finnes ingen malfunksjoner tilgjengelig, eller det oppstod et problem med kommunikasjonen til backend.',
          'templatingExtensions.content.searchFieldPlaceholder':
            'Søk etter en funksjon',
          'templatingExtensions.content.filters.title': 'Filtre',
          'templatingExtensions.content.filters.notAvailable':
            'Det finnes ingen malfiltre definert.',
          'templatingExtensions.content.filters.metadataAbsent':
            'Filtermetadata utilgjengelig',
          'templatingExtensions.content.filters.schema.input': 'Inndata',
          'templatingExtensions.content.filters.schema.arguments': 'Argumenter',
          'templatingExtensions.content.filters.schema.output': 'Utdata',
          'templatingExtensions.content.filters.examples': 'Eksempler',
          'templatingExtensions.content.functions.title': 'Funksjoner',
          'templatingExtensions.content.functions.notAvailable':
            'Det finnes ingen globale malfunksjoner definert.',
          'templatingExtensions.content.functions.metadataAbsent':
            'Funksjonsmetadata utilgjengelig',
          'templatingExtensions.content.functions.schema.arguments':
            'Argumenter',
          'templatingExtensions.content.functions.schema.output': 'Utdata',
          'templatingExtensions.content.functions.examples': 'Eksempler',
          'templatingExtensions.content.values.title': 'Verdier',
          'templatingExtensions.content.values.notAvailable':
            'Det finnes ingen globale malverdier definert.',
          'templateIntroPage.title': 'Administrer maler',
          'templateIntroPage.subtitle':
            'Rediger, forhåndsvis og prøv ut maler, skjemaer og egendefinerte felter',
          'templateFormPage.title': 'Malredigerer',
          'templateFormPage.subtitle':
            'Rediger, forhåndsvis og prøv ut malskjemaer',
          'templateCustomFieldPage.title': 'Egendefinert feltutforsker',
          'templateCustomFieldPage.subtitle':
            'Rediger, forhåndsvis og prøv ut egendefinerte felter',
          'templateEditorPage.title': 'Malredigerer',
          'templateEditorPage.subtitle':
            'Rediger, forhåndsvis og prøv ut maler og malskjemaer',
          'templateEditorPage.dryRunResults.title': 'Testkjøringsresultater',
          'templateEditorPage.dryRunResultsList.title': 'Resultat {{resultId}}',
          'templateEditorPage.dryRunResultsList.downloadButtonTitle':
            'Last ned som .zip',
          'templateEditorPage.dryRunResultsList.deleteButtonTitle':
            'Slett resultat',
          'templateEditorPage.dryRunResultsView.tab.files': 'Filer',
          'templateEditorPage.dryRunResultsView.tab.log': 'Logg',
          'templateEditorPage.dryRunResultsView.tab.output': 'Utdata',
          'templateEditorPage.taskStatusStepper.skippedStepTitle':
            'Hoppet over',
          'templateEditorPage.customFieldExplorer.selectFieldLabel':
            'Velg egendefinert feltutvidelse',
          'templateEditorPage.customFieldExplorer.fieldForm.title':
            'Feltalternativer',
          'templateEditorPage.customFieldExplorer.fieldForm.applyButtonTitle':
            'Bruk',
          'templateEditorPage.customFieldExplorer.fieldPreview.title':
            'Forhåndsvisning av felt',
          'templateEditorPage.customFieldExplorer.preview.title': 'Mal-spec',
          'templateEditorPage.templateEditorBrowser.closeConfirmMessage':
            'Er du sikker? Ulagrede endringer vil gå tapt',
          'templateEditorPage.templateEditorBrowser.saveIconTooltip':
            'Lagre alle filer',
          'templateEditorPage.templateEditorBrowser.reloadIconTooltip':
            'Last inn mappe på nytt',
          'templateEditorPage.templateEditorBrowser.closeIconTooltip':
            'Lukk mappe',
          'templateEditorPage.templateEditorIntro.title':
            'Kom i gang ved å velge et av alternativene nedenfor',
          'templateEditorPage.templateEditorIntro.loadLocal.title':
            'Last inn malmappe',
          'templateEditorPage.templateEditorIntro.loadLocal.description':
            'Last inn en lokal malmappe, slik at du kan redigere og prøve å kjøre din egen mal.',
          'templateEditorPage.templateEditorIntro.loadLocal.unsupportedTooltip':
            'Støttes kun i noen Chromium-baserte nettlesere med siden lastet over HTTPS',
          'templateEditorPage.templateEditorIntro.createLocal.title':
            'Opprett ny mal',
          'templateEditorPage.templateEditorIntro.createLocal.description':
            'Opprett en lokal malmappe, slik at du kan redigere og prøve å kjøre din egen mal.',
          'templateEditorPage.templateEditorIntro.createLocal.unsupportedTooltip':
            'Støttes kun i noen Chromium-baserte nettlesere med siden lastet over HTTPS',
          'templateEditorPage.templateEditorIntro.formEditor.title':
            'Malskjema-lekeplass',
          'templateEditorPage.templateEditorIntro.formEditor.description':
            'Forhåndsvis og rediger et malskjema, enten ved å bruke en eksempelmal eller ved å laste en mal fra katalogen.',
          'templateEditorPage.templateEditorIntro.fieldExplorer.title':
            'Egendefinert feltutforsker',
          'templateEditorPage.templateEditorIntro.fieldExplorer.description':
            'Vis og lek med tilgjengelige installerte egendefinerte feltutvidelser.',
          'templateEditorPage.templateEditorTextArea.saveIconTooltip':
            'Lagre fil',
          'templateEditorPage.templateEditorTextArea.refreshIconTooltip':
            'Last inn fil på nytt',
          'templateEditorPage.templateEditorTextArea.emptyStateParagraph':
            'Vennligst velg en handling fra filmenyen.',
          'templateEditorPage.templateFormPreviewer.title':
            'Last inn eksisterende mal',
          'templateEditorToolbar.customFieldExplorerTooltip':
            'Egendefinert feltutforsker',
          'templateEditorToolbar.installedActionsDocumentationTooltip':
            'Dokumentasjon for installerte handlinger',
          'templateEditorToolbar.templatingExtensionsDocumentationTooltip':
            'Dokumentasjon for malfunksjoner',
          'templateEditorToolbar.addToCatalogButton': 'Publiser',
          'templateEditorToolbar.addToCatalogDialogTitle': 'Publiser endringer',
          'templateEditorToolbar.addToCatalogDialogContent.stepsIntroduction':
            'Følg instruksjonene nedenfor for å opprette eller oppdatere en mal:',
          'templateEditorToolbar.addToCatalogDialogContent.stepsListItems':
            'Lagre malfilene i en lokal mappe\nOpprett en pull request til et nytt eller eksisterende git-repositorium\nHvis malen allerede finnes, vil endringene bli reflektert i programvarekatalogen når pull requesten er slått sammen\nMen hvis du oppretter en ny mal, følg dokumentasjonen nedenfor for å registrere det nye malrepositoriet i programvarekatalogen',
          'templateEditorToolbar.addToCatalogDialogActions.documentationButton':
            'Gå til dokumentasjonen',
          'templateEditorToolbar.addToCatalogDialogActions.documentationUrl':
            'https://backstage.io/docs/features/software-templates/adding-templates/',
          'templateEditorToolbarFileMenu.button': 'Fil',
          'templateEditorToolbarFileMenu.options.openDirectory':
            'Åpne malmappe',
          'templateEditorToolbarFileMenu.options.createDirectory':
            'Opprett malmappe',
          'templateEditorToolbarFileMenu.options.closeEditor':
            'Lukk malredigerer',
          'templateEditorToolbarTemplatesMenu.button': 'Maler',
        },
      }),
  },
});

export const catalogGraphNorwegianTranslation = createTranslationResource({
  ref: catalogGraphTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'catalogGraphCard.title': 'Relasjoner',
          'catalogGraphCard.deepLinkTitle': 'Vis graf',
          'catalogGraphPage.title': 'Katalog-graf',
          'catalogGraphPage.filterToggleButtonTitle': 'Filtre',
          'catalogGraphPage.supportButtonDescription':
            'Begynn å spore komponenten din ved å legge den til i programvarekatalogen.',
          'catalogGraphPage.simplifiedSwitchLabel': 'Forenklet',
          'catalogGraphPage.mergeRelationsSwitchLabel': 'Slå sammen relasjoner',
          'catalogGraphPage.zoomOutDescription':
            'Bruk klyping og zoom for å navigere i diagrammet. Klikk for å endre aktiv node, shift-klikk for å navigere til entitet.',
          'catalogGraphPage.curveFilter.title': 'Kurve',
          'catalogGraphPage.curveFilter.curveMonotoneX': 'Monoton X',
          'catalogGraphPage.curveFilter.curveStepBefore': 'Trinn før',
          'catalogGraphPage.directionFilter.title': 'Retning',
          'catalogGraphPage.directionFilter.leftToRight': 'Venstre til høyre',
          'catalogGraphPage.directionFilter.rightToLeft': 'Høyre til venstre',
          'catalogGraphPage.directionFilter.topToBottom': 'Topp til bunn',
          'catalogGraphPage.directionFilter.bottomToTop': 'Bunn til topp',
          'catalogGraphPage.maxDepthFilter.title': 'Maks dybde',
          'catalogGraphPage.maxDepthFilter.inputPlaceholder': '∞ Uendelig',
          'catalogGraphPage.maxDepthFilter.clearButtonAriaLabel':
            'Fjern maks dybde',
          'catalogGraphPage.selectedKindsFilter.title': 'Kinds',
          'catalogGraphPage.selectedRelationsFilter.title': 'Relasjoner',
        },
      }),
  },
});

export const searchNorwegianTranslation = createTranslationResource({
  ref: searchTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'searchModal.viewFullResults': 'Vis alle resultater',
          'searchType.allResults': 'Alle resultater',
          'searchType.tabs.allTitle': 'Alle',
          'searchType.accordion.allTitle': 'Alle',
          'searchType.accordion.collapse': 'Skjul',
          'searchType.accordion.numberOfResults': '{{number}} resultater',
          'sidebarSearchModal.title': 'Søk',
        },
      }),
  },
});

export const homeNorwegianTranslation = createTranslationResource({
  ref: homeTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'addWidgetDialog.title': 'Legg til ny widget i dashbordet',
          'customHomepageButtons.edit': 'Rediger',
          'customHomepageButtons.restoreDefaults': 'Gjenopprett standarder',
          'customHomepageButtons.clearAll': 'Fjern alle',
          'customHomepageButtons.addWidget': 'Legg til widget',
          'customHomepageButtons.save': 'Lagre',
          'customHomepageButtons.cancel': 'Avbryt',
          'customHomepage.noWidgets':
            "Ingen widgeter lagt til. Begynn ved å klikke 'Legg til widget'-knappen.",
          'widgetSettingsOverlay.editSettingsTooptip': 'Rediger innstillinger',
          'widgetSettingsOverlay.deleteWidgetTooltip': 'Slett widget',
          'widgetSettingsOverlay.submitButtonTitle': 'Send',
          'widgetSettingsOverlay.cancelButtonTitle': 'Avbryt',
          'starredEntityListItem.removeFavoriteEntityTitle':
            'Fjern entitet fra favoritter',
          'visitList.empty.title': 'Det er ingen besøk å vise ennå.',
          'visitList.empty.description':
            'Når du begynner å bruke Backstage, vil besøkene dine dukke opp her som en hurtiglenke for å fortsette der du slapp.',
          'visitList.few.title':
            'Jo flere sider du besøker, desto flere sider vil dukke opp her.',
          'quickStart.title': 'Onboarding',
          'quickStart.description': 'Kom i gang med Backstage',
          'quickStart.learnMoreLinkTitle': 'Lær mer',
          'starredEntities.noStarredEntitiesMessage':
            'Klikk på stjernen ved siden av et entitetsnavn for å legge den til i denne listen!',
          'visitedByType.action.viewMore': 'Vis flere',
          'visitedByType.action.viewLess': 'Vis færre',
          'featuredDocsCard.learnMoreTitle': 'LÆR MER',
          'featuredDocsCard.empty.title': 'Ingen dokumenter å vise',
          'featuredDocsCard.empty.description':
            'Opprett ditt eget dokument. Sjekk ut vår kom-i-gang-informasjon',
          'featuredDocsCard.empty.learnMoreLinkTitle': 'DOKUMENTASJON',
        },
      }),
  },
});

export const userSettingsNorwegianTranslation = createTranslationResource({
  ref: userSettingsTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'languageToggle.title': 'Språk',
          'languageToggle.description': 'Endre språk',
          'languageToggle.select': 'Velg språk {{language}}',
          'themeToggle.title': 'Tema',
          'themeToggle.description': 'Endre temamodus',
          'themeToggle.select': 'Velg {{theme}}',
          'themeToggle.selectAuto': 'Velg automatisk tema',
          'themeToggle.names.light': 'Lyst',
          'themeToggle.names.dark': 'Mørkt',
          'themeToggle.names.auto': 'Automatisk',
          'signOutMenu.title': 'Logg ut',
          'signOutMenu.moreIconTitle': 'mer',
          'pinToggle.title': 'Fest sidepanel',
          'pinToggle.description': 'Hindre at sidepanelet kollapser',
          'pinToggle.switchTitles.unpin': 'Løsne sidepanel',
          'pinToggle.switchTitles.pin': 'Fest sidepanel',
          'pinToggle.ariaLabelTitle': 'Fest sidepanel-bryter',
          'identityCard.title': 'Backstage-identitet',
          'identityCard.noIdentityTitle': 'Ingen Backstage-identitet',
          'identityCard.userEntity': 'Brukerentitet',
          'identityCard.ownershipEntities': 'Eierskapsentiteter',
          'defaultProviderSettings.description':
            'Gir autentisering mot {{provider}} API-er og identiteter',
          'emptyProviders.title': 'Ingen autentiseringsleverandører',
          'emptyProviders.description':
            'Du kan legge til autentiseringsleverandører i Backstage, som lar deg bruke disse leverandørene for å autentisere deg.',
          'emptyProviders.action.title':
            'Åpne app-config.yaml og gjør endringene som vist nedenfor:',
          'emptyProviders.action.readMoreButtonTitle': 'Les mer',
          'providerSettingsItem.title.signIn': 'Logg inn på {{title}}',
          'providerSettingsItem.title.signOut': 'Logg ut fra {{title}}',
          'providerSettingsItem.buttonTitle.signIn': 'Logg inn',
          'providerSettingsItem.buttonTitle.signOut': 'Logg ut',
          'authProviders.title': 'Tilgjengelige leverandører',
          'defaultSettingsPage.tabsTitle.general': 'Generelt',
          'defaultSettingsPage.tabsTitle.authProviders':
            'Autentiseringsleverandører',
          'defaultSettingsPage.tabsTitle.featureFlags': 'Funksjonsflagg',
          'featureFlags.title': 'Funksjonsflagg',
          'featureFlags.description':
            'Vennligst oppdater siden etter å ha endret funksjonsflagg',
          'featureFlags.emptyFlags.title': 'Ingen funksjonsflagg',
          'featureFlags.emptyFlags.description':
            'Funksjonsflagg gjør det mulig for plugins å registrere funksjoner i Backstage som brukere kan velge å aktivere. Du kan bruke dette til å skille ut logikk i koden din for manuell A/B-testing, osv.',
          'featureFlags.emptyFlags.action.title':
            'Et eksempel på hvordan du legger til et funksjonsflagg er vist nedenfor:',
          'featureFlags.emptyFlags.action.readMoreButtonTitle': 'Les mer',
          'featureFlags.filterTitle': 'Filter',
          'featureFlags.clearFilter': 'Fjern filter',
          'featureFlags.flagItem.title.disable': 'Deaktiver',
          'featureFlags.flagItem.title.enable': 'Aktiver',
          'featureFlags.flagItem.subtitle.registeredInApplication':
            'Registrert i applikasjonen',
          'featureFlags.flagItem.subtitle.registeredInPlugin':
            'Registrert i {{pluginId}}-pluginen',
          'settingsLayout.title': 'Innstillinger',
          sidebarTitle: 'Innstillinger',
          'profileCard.title': 'Profil',
          'appearanceCard.title': 'Utseende',
        },
      }),
  },
});

export const notificationsNorwegianTranslation = createTranslationResource({
  ref: notificationsTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'notificationsPage.title': 'Varsler',
          'notificationsPage.tableTitle.all_one': 'Alle varsler ({{count}})',
          'notificationsPage.tableTitle.all_other': 'Alle varsler ({{count}})',
          'notificationsPage.tableTitle.saved_one':
            'Lagrede varsler ({{count}})',
          'notificationsPage.tableTitle.saved_other':
            'Lagrede varsler ({{count}})',
          'notificationsPage.tableTitle.unread_one':
            'Uleste varsler ({{count}})',
          'notificationsPage.tableTitle.unread_other':
            'Uleste varsler ({{count}})',
          'notificationsPage.tableTitle.read_one': 'Leste varsler ({{count}})',
          'notificationsPage.tableTitle.read_other':
            'Leste varsler ({{count}})',
          'filters.title': 'Filtre',
          'filters.view.label': 'Visning',
          'filters.view.unread': 'Uleste varsler',
          'filters.view.read': 'Leste varsler',
          'filters.view.saved': 'Lagrede',
          'filters.view.all': 'Alle',
          'filters.createdAfter.label': 'Sendt ut',
          'filters.createdAfter.placeholder': 'Varsler siden',
          'filters.createdAfter.last24h': 'Siste 24 timer',
          'filters.createdAfter.lastWeek': 'Siste uke',
          'filters.createdAfter.anyTime': 'Når som helst',
          'filters.sortBy.label': 'Sorter etter',
          'filters.sortBy.placeholder': 'Felt å sortere etter',
          'filters.sortBy.newest': 'Nyeste øverst',
          'filters.sortBy.oldest': 'Eldste øverst',
          'filters.sortBy.topic': 'Emne',
          'filters.sortBy.origin': 'Opprinnelse',
          'filters.severity.label': 'Minste alvorlighetsgrad',
          'filters.severity.critical': 'Kritisk',
          'filters.severity.high': 'Høy',
          'filters.severity.normal': 'Normal',
          'filters.severity.low': 'Lav',
          'filters.topic.label': 'Emne',
          'filters.topic.anyTopic': 'Alle emner',
          'table.emptyMessage': 'Ingen oppføringer å vise',
          'table.pagination.firstTooltip': 'Første side',
          'table.pagination.labelDisplayedRows': '{from}-{to} av {count}',
          'table.pagination.labelRowsSelect': 'rader',
          'table.pagination.lastTooltip': 'Siste side',
          'table.pagination.nextTooltip': 'Neste side',
          'table.pagination.previousTooltip': 'Forrige side',
          'table.bulkActions.markAllRead': 'Merk alle som lest',
          'table.bulkActions.markSelectedAsRead': 'Merk valgte som lest',
          'table.bulkActions.returnSelectedAmongUnread':
            'Flytt valgte tilbake til uleste',
          'table.bulkActions.saveSelectedForLater': 'Lagre valgte til senere',
          'table.bulkActions.undoSaveForSelected': 'Angre lagring for valgte',
          'table.confirmDialog.title': 'Er du sikker?',
          'table.confirmDialog.markAllReadDescription':
            'Merk <b>alle</b> varsler som <b>lest</b>.',
          'table.confirmDialog.markAllReadConfirmation': 'Merk alle',
          'table.errors.markAllReadFailed':
            'Kunne ikke merke alle varsler som lest',
          'sidebar.title': 'Varsler',
          'sidebar.errors.markAsReadFailed':
            'Kunne ikke merke varselet som lest',
          'sidebar.errors.fetchNotificationFailed': 'Kunne ikke hente varselet',
          'settings.title': 'Varslingsinnstillinger',
          'settings.errorTitle': 'Kunne ikke laste innstillinger',
          'settings.noSettingsAvailable':
            'Ingen varslingsinnstillinger tilgjengelig, prøv igjen senere',
          'settings.table.origin': 'Opprinnelse',
          'settings.table.topic': 'Emne',
          'settings.errors.useNotificationFormat': null,
        },
      }),
  },
});

export const coreComponentsNorwegianTranslation = createTranslationResource({
  ref: coreComponentsTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'signIn.title': 'Logg inn',
          'signIn.loginFailed': 'Innlogging mislyktes',
          'signIn.customProvider.title': 'Egendefinert bruker',
          'signIn.customProvider.subtitle':
            'Skriv inn din egen bruker-ID og legitimasjon.\nDette valget vil ikke bli lagret.',
          'signIn.customProvider.userId': 'Bruker-ID',
          'signIn.customProvider.tokenInvalid':
            'Token er ikke et gyldig OpenID Connect JWT-token',
          'signIn.customProvider.continue': 'Fortsett',
          'signIn.customProvider.idToken': 'ID-token (valgfritt)',
          'signIn.guestProvider.title': 'Gjest',
          'signIn.guestProvider.subtitle':
            'Logg inn som gjestebruker.\nDu vil ikke ha en verifisert identitet, noe som betyr at noen funksjoner kan være utilgjengelige.',
          'signIn.guestProvider.enter': 'Logg inn',
          skipToContent: 'Gå til innhold',
          'copyTextButton.tooltipText': 'Tekst kopiert til utklippstavlen',
          'simpleStepper.reset': 'Tilbakestill',
          'simpleStepper.finish': 'Fullfør',
          'simpleStepper.next': 'Neste',
          'simpleStepper.skip': 'Hopp over',
          'simpleStepper.back': 'Tilbake',
          'errorPage.subtitle': 'FEIL {{status}}: {{statusMessage}}',
          'errorPage.title': 'Oi, noe gikk galt!',
          'errorPage.goBack': 'Gå tilbake',
          'errorPage.showMoreDetails': 'Vis flere detaljer',
          'errorPage.showLessDetails': 'Vis færre detaljer',
          'emptyState.missingAnnotation.title': 'Manglende merknad',
          'emptyState.missingAnnotation.actionTitle':
            'Legg til merknaden i komponentens YAML-fil som vist i det uthevede eksempelet nedenfor:',
          'emptyState.missingAnnotation.readMore': 'Les mer',
          'supportConfig.default.title': 'Support ikke konfigurert',
          'supportConfig.default.linkTitle':
            "Legg til 'app.support' konfigurasjonsnøkkel",
          'errorBoundary.title':
            'Vennligst kontakt {{slackChannel}} for hjelp.',
          'oauthRequestDialog.title': 'Innlogging påkrevd',
          'oauthRequestDialog.authRedirectTitle':
            'Dette vil utløse en HTTP-omdirigering til OAuth-innlogging.',
          'oauthRequestDialog.login': 'Logg inn',
          'oauthRequestDialog.rejectAll': 'Avvis alle',
          'oauthRequestDialog.message':
            'Logg inn for å gi {{appTitle}} tilgang til {{provider}} API-er og identiteter.',
          'supportButton.title': 'Hjelp',
          'supportButton.close': 'Lukk',
          'table.filter.title': 'Filtre',
          'table.filter.clearAll': 'Fjern alle',
          'table.filter.placeholder': 'Alle resultater',
          'table.body.emptyDataSourceMessage': 'Ingen oppføringer å vise',
          'table.pagination.firstTooltip': 'Første side',
          'table.pagination.labelDisplayedRows': '{from}-{to} av {count}',
          'table.pagination.labelRowsSelect': 'rader',
          'table.pagination.lastTooltip': 'Siste side',
          'table.pagination.nextTooltip': 'Neste side',
          'table.pagination.previousTooltip': 'Forrige side',
          'table.toolbar.search': 'Filter',
          'table.header.actions': 'Handlinger',
          'alertDisplay.message_one': '({{ count }} nyere melding)',
          'alertDisplay.message_other': '({{ count }} nyere meldinger)',
          'dependencyGraph.fullscreenTooltip': 'Veksle fullskjerm',
          'logViewer.searchField.placeholder': 'Søk',
          'autoLogout.stillTherePrompt.title':
            'Logger ut på grunn av inaktivitet',
          'autoLogout.stillTherePrompt.buttonText': 'Ja! Ikke logg meg ut',
          'proxiedSignInPage.title':
            'Du ser ikke ut til å være innlogget. Prøv å laste siden på nytt.',
        },
      }),
  },
});
