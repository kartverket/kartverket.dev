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

export const functionLinkCardTranslationRef = createTranslationRef({
  id: 'functionLinkCard',
  messages: {
    'functionLinkCard.title': 'Security forms',
    'functionLinkCard.subtitle':
      'Here you can find the current security forms for this function. You can create new forms or update existing ones.',
    'functionLinkCard.createNewForm': 'Create new form',
    'functionLinkCard.selectForm': 'Select form',
    'functionLinkCard.create': 'Create',
    'functionLinkCard.creating': 'Creating...',
    'functionLinkCard.cancel': 'Cancel',
    'functionLinkCard.noFormsYet': 'No forms created yet',
    'functionLinkCard.formCreatedSuccess': 'Form was created',
    'functionLinkCard.fetchError': 'Could not fetch security forms',
    'functionLinkCard.fetchUnauthorized':
      'You do not have access to view security forms for this function. You must be a member of the owning group.',
    'functionLinkCard.createError': 'Could not create form',
    'groupFormCard.title': 'Security Forms',
    'groupFormCard.teamTab': 'Team forms',
    'groupFormCard.functionsTab': 'Forms for this teams owned functions',
    'groupFormCard.noTeamForms': 'No security forms created yet',
    'groupFormCard.noFunctionForms':
      'No security forms for functions created yet',
    'groupFormCard.fetchError': 'Could not fetch security forms',
    'groupFormCard.fetchUnauthorized':
      'You do not have access to view security forms for this group. You must be a member of the group.',
    'groupFormCard.createNewForm': 'Create new form',
    'groupFormCard.createNewTeamForm': 'Create new team form',
    'groupFormCard.createNewFunctionForm': 'Create new form for function',
    'groupFormCard.selectForm': 'Select form',
    'groupFormCard.selectFunction': 'Select function',
    'groupFormCard.create': 'Create',
    'groupFormCard.creating': 'Creating...',
    'groupFormCard.cancel': 'Cancel',
    'groupFormCard.formCreatedSuccess': 'Form was created',
    'groupFormCard.createError': 'Could not create form',
    'groupFormCard.allFormsCreated':
      'All form types already created for this function',
    'formMetrics.answered': '{{answered}}/{{total}} answered',
    'formMetrics.expired': '{{expired}} expired',
  },
});

export const functionLinkCardNorwegianTranslation = createTranslationResource({
  ref: functionLinkCardTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'functionLinkCard.title': 'Sikkerhetsskjemaer',
          'functionLinkCard.subtitle':
            'Her finner du gjeldende sikkerhetsskjemaer for funksjonen. Du kan opprette nye eller oppdatere eksisterende.',
          'functionLinkCard.createNewForm': 'Opprett nytt skjema',
          'functionLinkCard.selectForm': 'Velg skjema',
          'functionLinkCard.create': 'Opprett',
          'functionLinkCard.creating': 'Oppretter...',
          'functionLinkCard.cancel': 'Avbryt',
          'functionLinkCard.noFormsYet': 'Ingen skjemaer opprettet ennå',
          'functionLinkCard.formCreatedSuccess': 'Skjema ble opprettet',
          'functionLinkCard.fetchError': 'Kunne ikke hente sikkerhetsskjemaer',
          'functionLinkCard.fetchUnauthorized':
            'Du har ikke tilgang til å se sikkerhetsskjemaer for denne funksjonen. Du må være medlem av gruppen som eier den.',
          'functionLinkCard.createError': 'Kunne ikke opprette skjema',
          'groupFormCard.title': 'Sikkerhetsskjemaer',
          'groupFormCard.teamTab': 'Skjemaer til teamet',
          'groupFormCard.functionsTab': 'Skjemaer til teamets funksjoner',
          'groupFormCard.noTeamForms':
            'Ingen sikkerhetsskjemaer opprettet ennå',
          'groupFormCard.noFunctionForms':
            'Ingen sikkerhetsskjemaer til funksjoner opprettet ennå',
          'groupFormCard.fetchError': 'Kunne ikke hente sikkerhetsskjemaer',
          'groupFormCard.fetchUnauthorized':
            'Du har ikke tilgang til å se sikkerhetsskjemaer for denne gruppen. Du må være medlem av gruppen.',
          'groupFormCard.createNewForm': 'Opprett nytt skjema',
          'groupFormCard.createNewTeamForm': 'Opprett nytt teamskjema',
          'groupFormCard.createNewFunctionForm':
            'Opprett nytt skjema til funksjon',
          'groupFormCard.selectForm': 'Velg skjema',
          'groupFormCard.selectFunction': 'Velg funksjon',
          'groupFormCard.create': 'Opprett',
          'groupFormCard.creating': 'Oppretter...',
          'groupFormCard.cancel': 'Avbryt',
          'groupFormCard.formCreatedSuccess': 'Skjema ble opprettet',
          'groupFormCard.createError': 'Kunne ikke opprette skjema',
          'groupFormCard.allFormsCreated':
            'Alle skjematyper er allerede opprettet for denne funksjonen',
          'formMetrics.answered': '{{answered}}/{{total}} besvart',
          'formMetrics.expired': '{{expired}} utgått',
        },
      }),
  },
});
