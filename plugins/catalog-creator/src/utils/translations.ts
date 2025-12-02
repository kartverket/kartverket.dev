import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const catalogCreatorMessages = {
  contentHeader: {
    title: 'Edit or Create Components',
  },
  repositorySearch: {
    label: 'Paste GitHub repository URL',
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
    titleField: {
      fieldName: 'Title',
      tooltipText:
        'A human-readable title for the component entity, shown in Backstage UI instead of the name when available. Optional.',
    },
    owner: {
      fieldName: 'Owner',
      tooltipText:
        'A reference to the owner (commonly a team), that bears ultimate responsibility for the entity, and has the authority and capability to develop and maintain it',
      placeholder: 'Select an owner',
    },
    tags: {
      fieldName: 'Tags',
      tooltipText: 'A list of custom tags used to classify catalog entities.',
      placeholder: 'Select or add tags',
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
        placeholder: 'Select resource or component...',
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
        fieldName: 'API Definition',
        tooltipText:
          'GitHub URL or relative path from repository root to the API definition file (OpenAPI, AsyncAPI, GraphQL, or gRPC). An example of a relative path could be /api-schema.json.',
      },

      inlineDefinitionInfo: {
        text: 'Inline API definition detected. The GitHub URL or path from the repository root will replace the existing inline content.',
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

    resourceForm: {
      type: {
        fieldName: 'Type',
        tooltipText: 'The type of the resource.',
        placeholder: 'Select or add type',
      },
      dependencyof: {
        fieldName: 'Dependency of',
        tooltipText:
          'Which components or systems that depends on this resource',
        placeholder: 'Select components/resources',
      },
      system: {
        fieldName: 'System',
        tooltipText: 'Reference to the system which the resource belongs to',
        placeholder: 'Select system',
      },
    },

    domainForm: {
      type: {
        fieldname: 'Type',
        tooltipText: 'The type of the domain',
        placeholder: 'Select or add type',
      },
    },
    errors: {
      noName: 'Add a name',
      nameNoSpace: 'Name cannot contain space',
      nameNoSpecialChar: 'Name cannot start or end with special characters',

      noOwner: 'Add an owner',
      ownerNoSpace: 'Name cannot contain space',

      systemNoSpace: 'System cannot contain space',
      noLifecycle: 'Choose a lifecycle',

      noType: 'Add a type',
      typeNoSpace: 'Type cannot contain space',

      APIsNoSpace: 'APIs cannot contain space',
      dependenciesNoSpace: 'Dependencies cannot contain space',

      definitionNoSpace: 'Definition URL cannot contain space',

      domainNoSpace: 'Domain cannot contain space',

      noDefinition: 'Add a relative path or URL to the API definition.',

      tagNoSpace: 'Tags cannot contain space',
      tagRegEx:
        'Tags can only contain alphanumerical characters and :,+, or # seperated by -, and they cannot be longer than 63 characters.',
    },

    infoAlerts: {
      alreadyExists: 'Catalog-info.yaml already exists. Editing existing file.',
      doesNotExist: 'Catalog-info.yaml does not exist. Creating a new file.',
    },

    knownErrorAlerts: {
      repoNotFound: 'Could not find the GitHub repository: ',
      couldNotCheckIfPRExists:
        'Could not check if the pull request already exists for: ',
      PRExists: 'There already exists a pull request: ',
      couldNotCreatePR:
        'Could not create a pull request. Make sure the URL is a github repo and that a pull request does not already exist.',
      analyzeLocationError:
        'Failed to identify or parse the file. Provide a URL to either the repository root or a full file path to a valid catalog-info.yaml file.',
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
    componentTitle: 'Component',
    componentParagraph: `A Component is a piece of software, such as a service, library or a
          website. Components will often correspond to a repository. Components can provide APIs that other components consume, and often
          depend on APIs and resources.`,
    APITitle: 'API',
    APIParagraph: `An API entity describes an API that a component provides and that
          other components consume. Public APIs are the primary ways which
          components interact. The API specification should be included in the
          API entity and the file path to this document should be added to the
          API entity, with the file path to the API definition so that
          the developer portal can provide detailed information.`,
    resourceTitle: 'Resource',
    resourceParagraph: `Resource entities represent shared shared resources that a component
          requires during runtime, such as object storage or other cloud
          services.`,
    linkText: `Learn more about entities and the Backstage catalog.`,
  },
  successPage: {
    successfullyCreatedPR: 'Successfully created a pull request: ',
    couldNotRetrieveURL: 'Could not retrieve pull request URL.',
    registerNew: 'Register a new component?',
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

          'repositorySearch.label': 'Lim inn URL til GitHub-repository under',
          'repositorySearch.placeholder': 'Skriv inn en URL',
          'repositorySearch.fetchButton': 'Hent!',

          'form.title': 'Catalog-info.yaml skjema',
          'form.requiredFields': 'Obligatoriske felter er markert med: ',
          'form.entity': '-entitet',

          'form.name.fieldName': 'Navn',
          'form.name.tooltipText':
            'Navnet på entiteten. Dette navnet er både ment for at mennesker skal kunne kjenne igjen entiteten, men også for maskiner og andre komponenter for å kunne referrere til entiteten. Det må være unikt.',

          'form.titleField.fieldName': 'Tittel',
          'form.titleField.tooltipText':
            'En tittel for entiteten, vist i utviklerportalen i stedet for navn når det er tilgjengelig. Det er ikke obligatorisk.',

          'form.owner.fieldName': 'Eier',
          'form.owner.tooltipText':
            'En refereanse til eieren (ofte et team) som har ansvaret for entiteten og har autorisasjon og kunnskapen til å utvikle og vedlikeholdet den.',
          'form.owner.placeholder': 'Velg en eier',

          'form.tags.fieldName': 'Tags',
          'form.tags.tooltipText':
            'En liste over tags (merkelapper) som kan brukes til å klassifisere entiteter i systemkatalogen.',
          'form.tags.placeholder': 'Velg eller legg til tag',

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
            'Velg komponenter eller ressurser...',

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
            'GitHub URL eller relativ filsti til API definisjonfilen (openAPI AsyncAPI, GraphQL, eller gRPC). Et eksempel på en relativ filsti kan være /api-schema.json.',
          'form.APIForm.inlineDefinitionInfo.text':
            'Inline API-definisjon oppdaget. Denne GitHub-URL-en eller filstien fra rot i repoet vil erstatte det eksisterende inline-innholdet.',

          'form.systemForm.type.fieldName': 'Type',
          'form.systemForm.type.tooltipText': 'Systemets type.',
          'form.systemForm.type.placeholder': 'Velg system',
          'form.systemForm.domain.fieldName': 'Domene',
          'form.systemForm.domain.tooltipText':
            'Referanse til domenet som systemet tilhører.',
          'form.systemForm.domain.placeholder': 'Velg domene',

          'form.resourceForm.type.fieldName': 'Type',
          'form.resourceForm.type.tooltipText': 'Typen til ressursen',
          'form.resourceForm.type.placeholder': 'Velg eller skriv inn type',

          'form.resourceForm.dependencyof.fieldName': 'Avhengigheter til',
          'form.resourceForm.dependencyof.tooltipText':
            'Hvilke komponenter eller systemer som er avhengige av denne ressursen',
          'form.resourceForm.dependencyof.placeholder':
            'Velg komponenter/ressurser',

          'form.resourceForm.system.fieldName': 'System',
          'form.resourceForm.system.tooltipText':
            'Referanse til systemet som ressursen tilhører',
          'form.resourceForm.system.placeholder': 'Velg system',

          'form.domainForm.type.fieldname': 'Type',
          'form.domainForm.type.tooltipText': 'Typen til domenet.',
          'form.domainForm.type.placeholder': 'Velg type',

          'form.infoAlerts.alreadyExists':
            'Catalog-info.yaml finnes fra før, du redigerer filen.',
          'form.infoAlerts.doesNotExist':
            'Catalog-info.yaml finnes ikke, du oppretter en ny fil.',

          'form.knownErrorAlerts.repoNotFound':
            'Kunne ikke finne GitHub-kodelager med URL: ',
          'form.knownErrorAlerts.PRExists':
            'Det finnes allerede en pull request: ',
          'form.knownErrorAlerts.couldNotCheckIfPRExists':
            'Kunne ikke sjekke om PR finnes fra før for GitHub-kodelager med URL: ',
          'form.knownErrorAlerts.couldNotCreatePR':
            'Kunne ikke lage en pull request. Sjekk at URL er et GitHub-kodelager og at det ikke finnes en eksisterende pull request.',
          'form.knownErrorAlerts.analyzeLocationError':
            'Kunne ikke identifisere eller parse filen. Oppgi en URL som enten peker til rotmappen i repositoriet eller en full filsti til en gyldig catalog-info.yaml-fil.',

          'form.errors.noName': 'Legg til navn',
          'form.errors.nameNoSpace': 'Navn kan ikke inneholde mellomrom',
          'form.errors.nameNoSpecialChar':
            'Navn kan ikke inneholde spesialtegn',

          'form.errors.noOwner': 'Legg til eier',
          'form.errors.ownerNoSpace': 'Eier kan ikke inneholde mellomrom',

          'form.errors.systemNoSpace': 'System kan ikke inneholde mellomrom',

          'form.errors.noLifecycle': 'Velg et livsyklusstadie',

          'form.errors.noType': 'Legg til en type',
          'form.errors.typeNoSpace': 'Type kan ikke inneholde mellomrom',

          'form.errors.APIsNoSpace': 'APIer kan ikke inneholde mellomrom',
          'form.errors.dependenciesNoSpace':
            'Avhengigheter kan ikke inneholde mellomrom',
          'form.errors.definitionNoSpace': 'URL kan ikke inneholde mellomrom',
          'form.errors.domainNoSpace': 'Domene kan ikke inneholde mellomrom',

          'form.errors.noDefinition':
            'Legg til en relativ filsti eller URL til API-definisjonen',

          'form.errors.tagNoSpace': 'Tags kan ikke inneholde mellomrom',
          'form.errors.tagRegEx':
            'Tags kan kun inneholde alfanumeriske tegn og :, + eller # separert med -, og de kan ikke være lengre enn 63 tegn.',

          'infoBox.title': 'Rediger eller lag catalog-info.yaml',
          'infoBox.p1':
            'Dette skjemaet hjelper deg med å opprette eller redigere catalog-info.yaml-filer som brukes av Backstage for å oppdage og administrere programvarekomponenter i katalogen. Skriv inn en GitHub-kodelager-URL for å legge den til i utviklerportalen, eller oppgi en lenke til en eksisterende catalog-info.yaml-fil for å redigere den ved hjelp av dette skjemaet.',
          'infoBox.p2':
            'Når skjemaet er fylt ut med de riktige entitetene, klikker du på Opprett Pull Request for å foreslå endringer eller tillegg til catalog-info.yaml-filen i det aktuelle kodelageret. Endringene trer i kraft først når pull request-en er slått sammen, og utviklerportalen har oppdatert katalogen sin.',
          'infoBox.subtitle': 'Hva er entiteter i Backstage?',
          'infoBox.p3':
            'Utviklerportalen er bygget med Backstage, som definerer et sett med entiteter som brukes til å bygge programvarekatalogen. Disse entitetene er delt inn i tre grupper: kjerneentiteter, økosystementiteter og organisatoriske entiteter. Kjerneentiteter inkluderer Component, API og Resource. Økosystementiteter inkluderer System og Domain. Organisatoriske entiteter inkluderer Group og User. Nedenfor finner du en kort forklaring av kjerneentiteter.',
          'infoBox.componentTitle': 'Component',
          'infoBox.componentParagraph':
            'En Component er et stykke programvare, for eksempel en tjeneste, et bibliotek eller et nettsted. Komponenter tilsvarer ofte et eget kodelager. Komponenter kan tilby API-er som andre komponenter bruker, og avhenger ofte av API-er og ressurser selv.',
          'infoBox.APITitle': 'API',
          'infoBox.APIParagraph':
            'En API-entitet beskriver et API som en komponent tilbyr, og som andre komponenter bruker. Offentlige API-er er den primære måten komponenter samhandler på. API-spesifikasjonen bør inkluderes i API-entiteter, og filbanen til dette dokumentet bør legges til i API-entiteter slik at utviklerportalen kan vise detaljert informasjon.',
          'infoBox.resourceTitle': 'Resource',
          'infoBox.resourceParagraph':
            'Resource-entiteter representerer delte ressurser som en komponent trenger under kjøring, for eksempel objektlagring eller andre skytjenester.',
          'infoBox.linkText': 'Lær mer om entiteter og Backstage-katalogen.',

          'successPage.successfullyCreatedPR': 'Opprettet en pull request: ',
          'successPage.couldNotRetrieveURL':
            'Klarte ikke hente URL for pull request.',
          'successPage.registerNew': 'Registrer en ny component?',
        },
      }),
  },
});
