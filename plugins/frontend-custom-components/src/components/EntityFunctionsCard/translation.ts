import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const entityFunctionsCardMessages = {
  entityFunctionsCard: {
    defaultTitle: 'Dependencies',
    columnName: 'Name',
    columnKind: 'Kind',
    emptyMessage: 'No functions found that depend on this entity',
  },
};

export const entityFunctionsCardTranslationRef = createTranslationRef({
  id: 'entityFunctionsCard',
  messages: entityFunctionsCardMessages,
});

export const entityFunctionsCardNorwegianTranslation =
  createTranslationResource({
    ref: entityFunctionsCardTranslationRef,
    translations: {
      no: () =>
        Promise.resolve({
          default: {
            'entityFunctionsCard.defaultTitle': 'Avhengigheter',
            'entityFunctionsCard.columnName': 'Navn',
            'entityFunctionsCard.columnKind': 'Kind',
            'entityFunctionsCard.emptyMessage':
              'Ingen funksjoner funnet som avhenger av denne entiteten',
          },
        }),
    },
  });
