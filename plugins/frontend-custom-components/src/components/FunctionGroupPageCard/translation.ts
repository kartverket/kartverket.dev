import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const functionGroupPageMessages = {
  functioncard: {
    title: 'Functions this team delivers to',
    subtitle:
      'Functions that this team enables through its systems or components',
    columnName: 'Name',
    columnDependsOn: 'depends on',
    emptyMessage: 'No functions found that is dependent on this group',
  },
};

export const functionGroupPageTranslationRef = createTranslationRef({
  id: 'functionGroupPage',
  messages: functionGroupPageMessages,
});

export const functionGroupPageNorwegianTranslation = createTranslationResource({
  ref: functionGroupPageTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'functioncard.title': 'Funksjoner gruppen leverer til',
          'functioncard.subtitle':
            'Funksjoner denne gruppen muliggjør gjennom sine systemer og komponenter',
          'functioncard.columnName': 'Navn',
          'functioncard.columnDependsOn': 'avhenger av',
          'functioncard.emptyMessage':
            'Ingen funksjoner funnet som er avhengig av denne gruppen',
        },
      }),
  },
});
