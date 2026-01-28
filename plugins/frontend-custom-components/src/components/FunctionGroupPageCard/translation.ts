import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const functionGroupPageMessages = {
  functioncard: {
    title: 'Functions',
    subtitle:
      'Functions that this team enables through its systems or components',
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
          'functioncard.title': 'Funksjoner',
          'functioncard.subtitle':
            'Funksjoner denne gruppen muliggjør gjennom sine systemer og komponenter',
        },
      }),
  },
});
