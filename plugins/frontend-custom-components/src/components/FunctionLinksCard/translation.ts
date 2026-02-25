/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const catalogTranslationRef = createTranslationRef({
  id: 'catalog',
  messages: {
    indexPage: {
      title: `{{orgName}} Catalog`,
      createButtonTitle: 'Create',
      supportButtonContent: 'All your software catalog entities',
    },
    aboutCard: {
      title: 'About',
      refreshButtonTitle: 'Schedule entity refresh',
      editButtonTitle: 'Edit Metadata',
      createSimilarButtonTitle: 'Create something similar',
      refreshScheduledMessage: 'Refresh scheduled',
      launchTemplate: 'Launch Template',
      viewTechdocs: 'View TechDocs',
      viewSource: 'View Source',
      descriptionField: {
        label: 'Description',
        value: 'No description',
      },
      ownerField: {
        label: 'Owner',
        value: 'No Owner',
      },
      domainField: {
        label: 'Domain',
        value: 'No Domain',
      },
      systemField: {
        label: 'System',
        value: 'No System',
      },
      parentComponentField: {
        label: 'Parent Component',
        value: 'No Parent Component',
      },
      typeField: {
        label: 'Type',
      },
      lifecycleField: {
        label: 'Lifecycle',
      },
      tagsField: {
        label: 'Tags',
        value: 'No Tags',
      },
      targetsField: {
        label: 'Targets',
      },
    },
    searchResultItem: {
      lifecycle: 'Lifecycle',
      Owner: 'Owner',
    },
    catalogTable: {
      warningPanelTitle: 'Could not fetch catalog entities.',
      viewActionTitle: 'View',
      editActionTitle: 'Edit',
      starActionTitle: 'Add to favorites',
      unStarActionTitle: 'Remove from favorites',
    },
    dependencyOfComponentsCard: {
      title: 'Dependency of components',
      emptyMessage: 'No component depends on this component',
    },
    dependsOnComponentsCard: {
      title: 'Depends on components',
      emptyMessage: 'No component is a dependency of this component',
    },
    dependsOnResourcesCard: {
      title: 'Depends on resources',
      emptyMessage: 'No resource is a dependency of this component',
    },
    entityContextMenu: {
      copiedMessage: 'Copied!',
      moreButtonTitle: 'More',
      inspectMenuTitle: 'Inspect entity',
      copyURLMenuTitle: 'Copy entity URL',
      unregisterMenuTitle: 'Unregister entity',
    },
    entityLabelsCard: {
      title: 'Labels',
      emptyDescription:
        'No labels defined for this entity. You can add labels to your entity YAML as shown in the highlighted example below:',
      readMoreButtonTitle: 'Read more',
    },
    entityLabels: {
      warningPanelTitle: 'Entity not found',
      ownerLabel: 'Owner',
      lifecycleLabel: 'Lifecycle',
    },
    entityLinksCard: {
      title: 'Links',
      emptyDescription:
        'No links defined for this entity. You can add links to your entity YAML as shown in the highlighted example below:',
      readMoreButtonTitle: 'Read more',
    },
    entityNotFound: {
      title: 'Entity was not found',
      description:
        'Want to help us build this? Check out our Getting Started documentation.',
      docButtonTitle: 'DOCS',
    },
    deleteEntity: {
      dialogTitle: 'Are you sure you want to delete this entity?',
      deleteButtonTitle: 'Delete',
      cancelButtonTitle: 'Cancel',
      description:
        'This entity is not referenced by any location and is therefore not receiving updates. Click here to delete.',
    },
    entityProcessingErrorsDescription: 'The error below originates from',
    entityRelationWarningDescription:
      "This entity has relations to other entities, which can't be found in the catalog.\n Entities not found are: ",
    hasComponentsCard: {
      title: 'Has components',
      emptyMessage: 'No component is part of this system',
    },
    hasResourcesCard: {
      title: 'Has resources',
      emptyMessage: 'No resource is part of this system',
    },
    hasSubcomponentsCard: {
      title: 'Has subcomponents',
      emptyMessage: 'No subcomponent is part of this component',
    },
    hasSubdomainsCard: {
      title: 'Has subdomains',
      emptyMessage: 'No subdomain is part of this domain',
    },
    hasSystemsCard: {
      title: 'Has systems',
      emptyMessage: 'No system is part of this domain',
    },
    relatedEntitiesCard: {
      emptyHelpLinkTitle: 'Learn how to change this',
    },
    systemDiagramCard: {
      title: 'System Diagram',
      description: 'Use pinch & zoom to move around the diagram.',
      edgeLabels: {
        partOf: 'part of',
        provides: 'provides',
        dependsOn: 'depends on',
      },
    },
  },
});
export const functionLinkCardTranslationRef = createTranslationRef({
  id: 'functionLinkCard',
  messages: {
    'functionLinkCard.title': 'Associated forms',
    'functionLinkCard.subtitle':
      'Here you can find the current forms for this function. You can create new forms or update existing ones.',
    'functionLinkCard.createNewForm': 'Create new form',
    'functionLinkCard.selectForm': 'Select form',
    'functionLinkCard.create': 'Create',
    'functionLinkCard.creating': 'Creating...',
    'functionLinkCard.cancel': 'Cancel',
    'functionLinkCard.noFormsYet': 'No forms created yet',
    'functionLinkCard.formCreatedSuccess': 'Form was created',
    'functionLinkCard.fetchError': 'Could not fetch forms',
    'functionLinkCard.createError': 'Could not create form',
    'groupFormCard.title': 'Security Forms',
    'groupFormCard.teamTab': '{{teamName}}',
    'groupFormCard.functionsTab': 'Owned functions',
    'groupFormCard.noTeamForms': 'No security forms created yet',
    'groupFormCard.noFunctionForms':
      'No security forms for functions created yet',
    'groupFormCard.fetchError': 'Could not fetch security forms',
    'groupFormCard.createNewForm': 'Create new form',
    'groupFormCard.selectForm': 'Select form',
    'groupFormCard.selectFunction': 'Select function',
    'groupFormCard.create': 'Create',
    'groupFormCard.creating': 'Creating...',
    'groupFormCard.cancel': 'Cancel',
    'groupFormCard.formCreatedSuccess': 'Form was created',
    'groupFormCard.createError': 'Could not create form',
    'groupFormCard.allFormsCreated':
      'All form types already created for this function',
  },
});

export const functionLinkCardNorwegianTranslation = createTranslationResource({
  ref: functionLinkCardTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'functionLinkCard.title': 'Tilhørende skjemaer',
          'functionLinkCard.subtitle':
            'Her finner du gjeldende skjemaer for funksjonen. Du kan opprette nye eller oppdatere eksisterende.',
          'functionLinkCard.createNewForm': 'Opprett nytt skjema',
          'functionLinkCard.selectForm': 'Velg skjema',
          'functionLinkCard.create': 'Opprett',
          'functionLinkCard.creating': 'Oppretter...',
          'functionLinkCard.cancel': 'Avbryt',
          'functionLinkCard.noFormsYet': 'Ingen skjemaer opprettet ennå',
          'functionLinkCard.formCreatedSuccess': 'Skjema ble opprettet',
          'functionLinkCard.fetchError': 'Kunne ikke hente skjemaer',
          'functionLinkCard.createError': 'Kunne ikke opprette skjema',
          'groupFormCard.title': 'Sikkerhetsskjemaer',
          'groupFormCard.teamTab': '{{teamName}}',
          'groupFormCard.functionsTab': 'Eide funksjoner',
          'groupFormCard.noTeamForms':
            'Ingen sikkerhetsskjemaer opprettet ennå',
          'groupFormCard.noFunctionForms':
            'Ingen sikkerhetsskjemaer til funksjoner opprettet ennå',
          'groupFormCard.fetchError': 'Kunne ikke hente sikkerhetsskjemaer',
          'groupFormCard.createNewForm': 'Opprett nytt skjema',
          'groupFormCard.selectForm': 'Velg skjema',
          'groupFormCard.selectFunction': 'Velg funksjon',
          'groupFormCard.create': 'Opprett',
          'groupFormCard.creating': 'Oppretter...',
          'groupFormCard.cancel': 'Avbryt',
          'groupFormCard.formCreatedSuccess': 'Skjema ble opprettet',
          'groupFormCard.createError': 'Kunne ikke opprette skjema',
          'groupFormCard.allFormsCreated':
            'Alle skjematyper er allerede opprettet for denne funksjonen',
        },
      }),
  },
});
