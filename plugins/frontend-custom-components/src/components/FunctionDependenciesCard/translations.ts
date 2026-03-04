import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

const functionDependenciesCardMessages = {
  functionDependenciesCard: {
    dependenciesTitle: 'Dependencies',
    dependenciesSubtitle:
      'The function is supported by the following systems and components. If anything is missing, you can add it via the Edit tab.',
    noDependenciesFound:
      'No entities found that this function or its child functions depend on.',
    entityHelpLinkText: 'Learn more about entities',
  },
};

export const functionDependenciesCardTranslationRef = createTranslationRef({
  id: 'functionDependenciesCard',
  messages: functionDependenciesCardMessages,
});

export const functionDependenciesCardNorwegianTranslation =
  createTranslationResource({
    ref: functionDependenciesCardTranslationRef,
    translations: {
      no: () =>
        Promise.resolve({
          default: {
            'functionDependenciesCard.dependenciesTitle': 'Avhengigheter',
            'functionDependenciesCard.dependenciesSubtitle':
              'Funksjonen støttes av følgende systemer og komponenter. Hvis noe mangler, kan du legge det til via Rediger-fanen.',
            'functionDependenciesCard.noDependenciesFound':
              'Ingen entiteter som denne funksjonen eller dens underfunksjoner er avhengig av er funnet.',
            'functionDependenciesCard.entityHelpLinkText':
              'Lær mer om entiteter',
          },
        }),
    },
  });
