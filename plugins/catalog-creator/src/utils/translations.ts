import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const catalogCreatorMessages = {
  contentHeader: {
    title: 'Edit or Create Components',
  },
  repositorySearch: {
    label: 'Repository URL',
    placeholder: 'Enter a URL',
    fetchButton: 'Fetch!',
  },

  form: {
    title: 'Catalog-info.yaml Form',
    requiredFields: 'Required fields marked with: ',
    entity: ' Entity',

    name: {
      fieldName: 'Name',
      tooltipText:
        'The name of the entity. This name is both meant for human eyes to recognize the entity, and for machines and other components to reference the entity. Must be unique',
    },
    owner: {
      fieldName: 'Owner',
      tooltipText:
        'A reference to the owner (commonly a team), that bears ultimate responsibility for the entity, and has the authority and capability to develop and maintain it',
      placeholder: 'Select an owner',
    },

    addEntity: {
      title: 'Add Entity',
      label: 'Select kind',
      buttonText: 'Add entity',
    },
    createPR: 'Create pull request',

    componentForm: {
      lifecycle: {
        fieldName: 'Lifecycle',
        tooltipText: 'The lifecycle state of the component.',
        placeholder: 'Select lifecycle state',
      },
      type: {
        fieldName: 'Type',
        tooltipText: 'The type of the component.',
        placeholder: 'Select type',
      },
      system: {
        fieldName: 'System',
        tooltipText: 'Reference to the system which the component belongs to.',
        placeholder: 'Select system',
      },
      providesAPIs: {
        fieldName: 'Provides APIs',
        tooltipText:
          'References to all the APIs the component may provide. This does not define the API-entity itself.',
        placeholder: 'Select or add API...',
      },

      consumesAPIs: {
        fieldName: 'Consumes APIs',
        tooltipText: 'APIs that are consumed by the component.',
        placeholder: 'Select or add API...',
      },
      dependsOn: {
        fieldName: 'Depends on',
        tooltipText:
          'References to other components and/or resources that the component depends on.',
        placeholder: 'Select or add resource or component...',
      },
    },

    APIForm: {
      lifecycle: {
        fieldName: 'Lifecycle',
        tooltipText: 'The lifecycle state of the API.',
        placeholder: 'Select lifecycle state',
      },
      type: {
        fieldName: 'Type',
        tooltipText: 'The type of the API.',
        placeholder: 'Select type',
      },
      system: {
        fieldName: 'System',
        tooltipText: 'Reference to the system which the API belongs to.',
        placeholder: 'Select system',
      },

      definition: {
        fieldName: 'API Definition (path or URL)',
        tooltipText:
          'Relative path to the API definition file (OpenAPI, AsyncAPI, GraphQL, or gRPC). Required for new APIs. If editing an existing API this field may already be populated, check the existing catalog-info.yaml',
      },
    },

    systemForm: {
      type: {
        fieldName: 'Type',
        tooltipText: 'The type of the system.',
        placeholder: 'Select type',
      },
      domain: {
        fieldName: 'Domain',
        tooltipText: 'Reference to the domain which the system i s a part of.',
        placeholder: 'Select domain',
      },
    },

    infoAlerts: {
      alreadyExists: 'Catalog-info.yaml already exists. Editing existing file.',
      doesNotExist: 'Catalog-info.yaml does not exist. Creating a new file.',
    },

    knownErrorAlerts: {
      repoNotFound: 'Could not find the GitHub repository: ',
      PRExists: 'There already exists a pull request: ',
    },
  },
  infoBox: {
    title: 'Edit or Generate Catalog-info.yaml',
    p1: `This form helps you create or edit catalog-info.yaml files used by Backstage to discover and manage software components in the catalog. Enter a GitHub repository URL to add it to the developer portal,
           or provide a link to an existing catalog-info.yaml file to edit it using this form.`,
    p2: `Once the form is completed with the correct entities, click "Create Pull Request" to propose changes or additions to the catalog-info.yaml file in the relevant repository. 
           The changes will take effect only after the pull request is merged and the developer portal updates its catalog.`,
    subtitle: 'What are Entities in Backstage?',
    p3: `The developer portal is built using Backstage, which defines a set of entities used to build the software catalog.
       These entities are seperated into three groups: core entities, ecosystem entities, and organizational entities.
        Core entities include Component, API, and Resource. Ecosystem entities include System and Domain.
         Organizational entities include Group and User. Below is a brief explanation of the core entities.`,
    componentParagraph: `A Component is a piece of software, such as a service, library or a
          website. Components will often correspond to a repository. Components can provide APIs that other components consume, and often
          depend on APIs and resources.`,
    APIParagraph: `An API entity describes an API that a component provides and that
          other components consume. Public APIs are the primary ways which
          components interact. The API specification should be included in the
          API entity and the file path to this document should be added to the
          API entity, with the file path to the API definition so that
          the developer portal can provide detailed information.`,
    resourceParagraph: `Resource entities represent shared shared resources that a component
          requires during runtime, such as object storage or other cloud
          services.`,
    linkText: `Learn more about entities and the Backstage catalog.`,
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

          'repositorySearch.label': 'Kodelager URL',
          'repositorySearch.placeholder': 'Skriv inn en URL',
          'repositorySearch.fetchButton': 'Hent!',

          'form.title': 'Catalog-info.yaml skjema',
          'form.requiredFields': 'Obligatoriske felter er markert med: ',
          'form.entity': '-entitet',

          'form.name.fieldName': 'Navn',
          'form.name.tooltipText':
            'Navnet på entiteten. Dette navnet er både ment for at mennesker skal kunne kjenne igjen entiteten, men også for maskiner og andre komponenter for å kunne referrere til entiteten. Det må være unikt.',

          'form.owner.fieldName': 'Eier',
          'form.owner.tooltipText':
            'En refereanse til eieren (ofte et team) som har ansvaret for entiteten og har autorisasjon og kunnskapen til å utvikle og vedlikeholdet den.',
          'form.owner.placeholder': 'Velg en eier',

          'form.addEntity.title': 'Legg til entitet',
          'form.addEntity.label': 'Velg entitet',
          'form.addEntity.buttonText': 'Legg til entitet',

          'form.createPR': 'Lag pull request',

          'form.componentForm.lifecycle.fieldName': 'Livssyklus',
          'form.componentForm.lifecycle.tooltipText':
            'Livssyklusstadiet til en komponent.',
          'form.componentForm.lifecycle.placeholder': 'Velg livssyklusstadie',

          'form.componentForm.type.fieldName': 'Type',
          'form.componentForm.type.tooltipText': 'Typen til komponenten.',
          'form.componentForm.type.placeholder': 'Velg type',

          'form.componentForm.system.fieldName': 'System',
          'form.componentForm.system.tooltipText':
            'Referanse til systemet som komponenten tilhører.',
          'form.componentForm.system.placeholder': 'Velg system',

          'form.componentForm.providesAPIs.fieldName': 'Tilbyr APIer',
          'form.componentForm.providesAPIs.tooltipText':
            'Referanse til alle APIer komponenten tilbyr. Et API som ikke finnes i listen må defineres i denne eller i en annen catalog-info.yaml.',
          'form.componentForm.providesAPIs.placeholder':
            'Velg eller legg til APIer...',

          'form.componentForm.consumesAPIs.fieldName': 'Bruker APIer',
          'form.componentForm.consumesAPIs.tooltipText':
            'Referanse til alle APIer komponenten tilbyr. Et API som ikke finnes i listen må defineres i denne eller i en annen catalog-info.yaml.',
          'form.componentForm.consumesAPIs.placeholder':
            'Velg eller legg til APIer...',

          'form.componentForm.dependsOn.fieldName': 'Avhenger av',
          'form.componentForm.dependsOn.tooltipText':
            'Referanse til komponenten eller ressurser som komponenten er avhengig av. En komponent eller ressurs som ikke finnes i listen må defineres i denne eller i en annen catalog-info.yaml.',
          'form.componentForm.dependsOn.placeholder':
            'Velg eller legg til komponenter eller ressurser...',

          'form.APIForm.lifecycle.fieldName': 'Livssyklus',
          'form.APIForm.lifecycle.tooltipText': 'Livssyklusstadiet til et API.',
          'form.APIForm.lifecycle.placeholder': 'Velg livssyklusstadie',

          'form.APIForm.type.fieldName': 'Type',
          'form.APIForm.type.tooltipText': 'Typen til APIet.',
          'form.APIForm.type.placeholder': 'Velg type',

          'form.APIForm.system.fieldName': 'System',
          'form.APIForm.system.tooltipText':
            'Referanse til systemet som APIet tilhører.',
          'form.APIForm.system.placeholder': 'Velg system',

          'form.APIForm.definition.fieldName': 'Definisjon',
          'form.APIForm.definition.tooltipText':
            'Relativ filsti til API definisjonfilen (openAPI AsyncAPI, GraphQL, eller gRPC). Obligatorisk for nye APIer. Hvis du redigerer et eksisterende API kan det hende at dette feltet er fylt ut med tekst som ikke vises. Se catalog-info.yaml filen med API definisjonen.',

          'form.systemForm.type.fieldName': 'Type',
          'form.systemForm.type.tooltipText': 'Systemets type.',
          'form.systemForm.type.placeholder': 'Velg system',

          'form.systemForm.domain.fieldName': 'Domene',
          'form.systemForm.domain.tooltipText':
            'Referanse til domenet som systemet tilhører.',
          'form.systemForm.domain.placeholder': 'Velg domene',

          'infoBox.title': 'Rediger eller lag catalog-info.yaml',
          'infoBox.p1':
            'Dette skjemaet hjelper deg med å opprette eller redigere catalog-info.yaml-filer som brukes av Backstage for å oppdage og administrere programvarekomponenter i katalogen. Skriv inn en GitHub-kodelager-URL for å legge den til i utviklerportalen, eller oppgi en lenke til en eksisterende catalog-info.yaml-fil for å redigere den ved hjelp av dette skjemaet.',
          'infoBox.p2':
            'Når skjemaet er fylt ut med de riktige entitetene, klikker du på Opprett Pull Request for å foreslå endringer eller tillegg til catalog-info.yaml-filen i det aktuelle kodelageret. Endringene trer i kraft først når pull request-en er slått sammen, og utviklerportalen har oppdatert katalogen sin.',
          'infoBox.subtitle': 'Hva er entiteter i Backstage?',
          'infoBox.p3':
            'Utviklerportalen er bygget med Backstage, som definerer et sett med entiteter som brukes til å bygge programvarekatalogen. Disse entitetene er delt inn i tre grupper: kjerneentiteter, økosystementiteter og organisatoriske entiteter. Kjerneentiteter inkluderer Component, API og Resource. Økosystementiteter inkluderer System og Domain. Organisatoriske entiteter inkluderer Group og User. Nedenfor finner du en kort forklaring av kjerneentiteter.',
          'infoBox.componentParagraph':
            'En Component er et stykke programvare, for eksempel en tjeneste, et bibliotek eller et nettsted. Komponenter tilsvarer ofte et eget kodelager. Komponenter kan tilby API-er som andre komponenter bruker, og avhenger ofte av API-er og ressurser selv.',
          'infoBox.APIParagraph':
            'En API-entitet beskriver et API som en komponent tilbyr, og som andre komponenter bruker. Offentlige API-er er den primære måten komponenter samhandler på. API-spesifikasjonen bør inkluderes i API-entiteter, og filbanen til dette dokumentet bør legges til i API-entiteter slik at utviklerportalen kan vise detaljert informasjon.',
          'infoBox.resourceParagraph':
            'Resource-entiteter representerer delte ressurser som en komponent trenger under kjøring, for eksempel objektlagring eller andre skytjenester.',
          'infoBox.linkText': 'Lær mer om entiteter og Backstage-katalogen.',

          'form.infoAlerts.alreadyExists':
            'Catalog-info.yaml finnes fra før, du redigerer filen.',
          'form.infoAlerts.doesNotExist':
            'Catalog-info.yaml finnes ikke, du oppretter en ny fil.',

          'form.knownErrorAlerts.repoNotFound':
            'Kunne ikke finne GitHub-kodelager med URL: ',
          'form.knownErrorAlerts.PRExists':
            'Det finnes allerede en pull request: ',
        },
      }),
  },
});
