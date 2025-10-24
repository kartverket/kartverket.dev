import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const catalogCreatorMessages = {
  contentHeader: {
    title: 'Edit or Create Components',
  },
} as const;

export const catalogCreatorTranslationRef = createTranslationRef({
  id: 'catalog.creator',
  messages: catalogCreatorMessages,
});

export const catalogCreatorNorwegianTranslation = createTranslationResource({
  ref: catalogCreatorTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          'contentHeader.title': 'Rediger eller lag komponenter',
        },
      }),
  },
});
