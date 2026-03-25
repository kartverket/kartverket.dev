import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const groupProfileCardMessages = {
  groupProfileCard: {
    groupNotFound: 'Group not found',
    editIconButtonTitle: 'Edit Metadata',
    refreshIconButtonTitle: 'Schedule entity refresh',
    refreshIconButtonAriaLabel: 'Refresh',
    refreshConfirmationMessage: 'Refresh scheduled',
    infoBanner:
      'The team can be edited in the EntraID configuration. Members are managed via the EntraID portal.',
    notAvailable: 'N/A',
    listItemTitle: {
      entityRef: 'Entity Ref',
      email: 'Email',
      parentGroup: 'Parent Group',
      childGroups: 'Child Groups',
    },
  },
};

export const groupProfileCardTranslationRef = createTranslationRef({
  id: 'groupProfileCard',
  messages: groupProfileCardMessages,
});

export const groupProfileCardNorwegianTranslation = createTranslationResource({
  ref: groupProfileCardTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'groupProfileCard.groupNotFound': 'Gruppen ble ikke funnet',
          'groupProfileCard.editIconButtonTitle': 'Rediger metadata',
          'groupProfileCard.refreshIconButtonTitle':
            'Planlegg oppdatering av entitet',
          'groupProfileCard.refreshIconButtonAriaLabel': 'Oppdater',
          'groupProfileCard.refreshConfirmationMessage': 'Oppdatering planlagt',
          'groupProfileCard.infoBanner':
            'Teamet kan redigeres i konfigurasjonen for EntraID. Medlemmene administreres via EntraID-portalen.',
          'groupProfileCard.notAvailable': 'Ikke tilgjengelig',
          'groupProfileCard.listItemTitle.entityRef': 'Entitetsreferanse',
          'groupProfileCard.listItemTitle.email': 'E-post',
          'groupProfileCard.listItemTitle.parentGroup': 'Overordnet gruppe',
          'groupProfileCard.listItemTitle.childGroups': 'Undergrupper',
        },
      }),
  },
});
