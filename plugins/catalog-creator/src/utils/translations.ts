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
      entityType: {
        fieldName: 'Type',
        tooltipText: 'The type of the component.',
        placeholder: 'Select type',
      },
      system: {
        fieldName: 'System',
        tooltipText: 'Reference to the system which the component belongs to.',
        placeholder: 'Select system',
      },
      providesApis: {
        fieldName: 'Provides APIs',
        tooltipText:
          'References to all the APIs the component may provide. This does not define the API-entity itself.',
        placeholder: 'Select API...',
      },

      consumesApis: {
        fieldName: 'Consumes APIs',
        tooltipText: 'APIs that are consumed by the component.',
        placeholder: 'Select API...',
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
      entityType: {
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
      entityType: {
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
      entityType: {
        fieldName: 'Type',
        tooltipText: 'The type of the resource.',
        placeholder: 'Select or add type',
      },
      dependencyOf: {
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

    functionForm: {
      entityType: {
        fieldName: 'Type',
        tooltipText: 'The type of the function.',
        placeholder: 'Select or add type',
      },
      dependsOnSystems: {
        fieldName: 'Depends on Systems',
        tooltipText: 'Systems that this function depends on.',
        placeholder: 'Select systems',
      },
      dependsOnComponents: {
        fieldName: 'Depends on Components',
        tooltipText: 'Components that this function depends on.',
        placeholder: 'Select components',
      },
      dependsOnFunctions: {
        fieldName: 'Depends on Functions',
        tooltipText: 'Other functions that this function depends on.',
        placeholder: 'Select functions',
      },
      childFunctions: {
        fieldName: 'Child Functions',
        tooltipText: 'Functions that are part of or belong to this function.',
        placeholder: 'Select functions',
      },
      links: {
        fieldName: 'Links',
        tooltipText: 'Url to external sites',
        placeholder: 'Add a url',
      },
    },

    domainForm: {
      entityType: {
        fieldName: 'Type',
        tooltipText: 'The type of the domain',
        placeholder: 'Select or add type',
      },
      subdomainOf: {
        fieldName: 'Subdomain',
        tooltipText:
          'A reference to other domains which is a part of this domain.',
        placeholder: 'Select subdomains',
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

      linksNoSpace: 'Url cannot contain space',
      linksLength: 'Url cannot be longer than 63 characters',
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
    title: 'How does the form work?',
    p1: `This form allows you to create or edit catalog-info.yaml files used by Backstage to discover and manage components. Enter the URL of a GitHub repository to add it to the developer portal, or provide a link to an existing file to edit it.`,
    p2: `When you're done, click Create Pull Request to propose changes in the repository. The updates take effect once the pull request has been merged and the catalog has been refreshed.`,
    subtitle: 'What are entities in Backstage?',
    p3: `The developer portal is built using Backstage, which defines a set of entities used to build the software catalog.
       These entities are seperated into three groups: core entities, ecosystem entities, and organizational entities.
        Core entities include Component, API, and Resource. Ecosystem entities include System and Domain.
         Organizational entities include Group and User. Below is a brief explanation of the core entities.`,
    systemTitle: 'System',
    systemParagraph:
      'A system is a collection of components that work together to fulfil a clear purpose within a specific domain. Together, they deliver complete functionality.',
    componentTitle: 'Component',
    componentParagraph: `A component is an independent part of a system — for example a service, a library, or an app. It often has its own repository and can be developed, built, and deployed separately from the rest of the system.`,
    APITitle: 'API ',
    APIParagraph: `An API describes the interface a component provides or consumes, and shows how systems and components communicate. The definition field for APIs is required.`,
    APIremark:
      'Note: External APIs should be registered as Resource, not as an API.',
    resourceTitle: 'Resource',
    resourceParagraph: `A Resource is an external or shared asset that a system or component depends on, but which is not necessarily owned by the same team. This can include technical infrastructure or external integrations.`,
    linkText: `Read more about entities in your organization.`,
    linkText2: `Read more about entities in the Backstage documentation `,
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

          'form.componentForm.entityType.fieldName': 'Type',
          'form.componentForm.entityType.tooltipText': 'Typen til komponenten.',
          'form.componentForm.entityType.placeholder': 'Velg type',

          'form.componentForm.system.fieldName': 'System',
          'form.componentForm.system.tooltipText':
            'Referanse til systemet som komponenten tilhører.',
          'form.componentForm.system.placeholder': 'Velg system',

          'form.componentForm.providesApis.fieldName': 'Tilbyr APIer',
          'form.componentForm.providesApis.tooltipText':
            'Referanse til alle APIer komponenten tilbyr. Et API som ikke finnes i listen må defineres i denne eller i en annen catalog-info.yaml.',
          'form.componentForm.providesApis.placeholder': 'Velg APIer...',

          'form.componentForm.consumesApis.fieldName': 'Bruker APIer',
          'form.componentForm.consumesApis.tooltipText':
            'Referanse til alle APIer komponenten tilbyr. Et API som ikke finnes i listen må defineres i denne eller i en annen catalog-info.yaml.',
          'form.componentForm.consumesApis.placeholder': 'Velg APIer...',

          'form.componentForm.dependsOn.fieldName': 'Avhenger av',
          'form.componentForm.dependsOn.tooltipText':
            'Referanse til komponenten eller ressurser som komponenten er avhengig av. En komponent eller ressurs som ikke finnes i listen må defineres i denne eller i en annen catalog-info.yaml.',
          'form.componentForm.dependsOn.placeholder':
            'Velg komponenter eller ressurser...',

          'form.APIForm.lifecycle.fieldName': 'Livssyklus',
          'form.APIForm.lifecycle.tooltipText': 'Livssyklusstadiet til et API.',
          'form.APIForm.lifecycle.placeholder': 'Velg livssyklusstadie',

          'form.APIForm.entityType.fieldName': 'Type',
          'form.APIForm.entityType.tooltipText': 'Typen til APIet.',
          'form.APIForm.entityType.placeholder': 'Velg type',

          'form.APIForm.system.fieldName': 'System',
          'form.APIForm.system.tooltipText':
            'Referanse til systemet som APIet tilhører.',
          'form.APIForm.system.placeholder': 'Velg system',
          'form.APIForm.definition.fieldName': 'Definisjon',
          'form.APIForm.definition.tooltipText':
            'GitHub URL eller relativ filsti til API definisjonfilen (openAPI AsyncAPI, GraphQL, eller gRPC). Et eksempel på en relativ filsti kan være /api-schema.json.',
          'form.APIForm.inlineDefinitionInfo.text':
            'Inline API-definisjon oppdaget. Denne GitHub-URL-en eller filstien fra rot i repoet vil erstatte det eksisterende inline-innholdet.',

          'form.systemForm.entityType.fieldName': 'Type',
          'form.systemForm.entityType.tooltipText': 'Systemets type.',
          'form.systemForm.entityType.placeholder':
            'Velg eller legg til systemets type',
          'form.systemForm.domain.fieldName': 'Domene',
          'form.systemForm.domain.tooltipText':
            'Referanse til domenet som systemet tilhører.',
          'form.systemForm.domain.placeholder': 'Velg domene',

          'form.resourceForm.entityType.fieldName': 'Type',
          'form.resourceForm.entityType.tooltipText': 'Typen til ressursen',
          'form.resourceForm.entityType.placeholder':
            'Velg eller skriv inn type',

          'form.resourceForm.dependencyOf.fieldName': 'Avhengigheter til',
          'form.resourceForm.dependencyOf.tooltipText':
            'Hvilke komponenter eller systemer som er avhengige av denne ressursen',
          'form.resourceForm.dependencyOf.placeholder':
            'Velg komponenter/ressurser',

          'form.resourceForm.system.fieldName': 'System',
          'form.resourceForm.system.tooltipText':
            'Referanse til systemet som ressursen tilhører',
          'form.resourceForm.system.placeholder': 'Velg system',

          'form.domainForm.entityType.fieldName': 'Type',
          'form.domainForm.entityType.tooltipText': 'Typen til domenet.',
          'form.domainForm.entityType.placeholder': 'Velg type',

          'form.domainForm.subdomainOf.fieldName': 'Subdomene',
          'form.domainForm.subdomainOf.tooltipText':
            'En eller flere referanser til underseksjoner av dette domenet.',
          'form.domainForm.subdomainOf.placeholder': 'Velg subdomener',

          'form.functionForm.entityType.fieldName': 'Type',
          'form.functionForm.entityType.tooltipText': 'Typen til funksjonen.',
          'form.functionForm.entityType.placeholder':
            'Velg eller legg til type',

          'form.functionForm.dependsOnSystems.fieldName':
            'Avhenger av systemer',
          'form.functionForm.dependsOnSystems.tooltipText':
            'Systemer som denne funksjonen er avhengig av.',
          'form.functionForm.dependsOnSystems.placeholder': 'Velg systemer',

          'form.functionForm.dependsOnComponents.fieldName':
            'Avhenger av komponenter',
          'form.functionForm.dependsOnComponents.tooltipText':
            'Komponenter som denne funksjonen er avhengig av.',
          'form.functionForm.dependsOnComponents.placeholder':
            'Velg komponenter',

          'form.functionForm.dependsOnFunctions.fieldName':
            'Avhenger av funksjoner',
          'form.functionForm.dependsOnFunctions.tooltipText':
            'Andre funksjoner som denne funksjonen er avhengig av.',
          'form.functionForm.dependsOnFunctions.placeholder': 'Velg funksjoner',

          'form.functionForm.childFunctions.fieldName': 'Underfunksjoner',
          'form.functionForm.childFunctions.tooltipText':
            'Funksjoner som er en del av eller tilhører denne funksjonen.',
          'form.functionForm.childFunctions.placeholder': 'Velg funksjoner',

          'form.functionForm.links.fieldName': 'Lenker',
          'form.functionForm.links.tooltipText': 'Url til ekstern side.',
          'form.functionForm.links.placeholder': 'Skriv inn url',

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

          'form.errors.linksNoSpace': 'Url kan ikke inneholde mellomrom',
          'form.errors.linksLength': 'url kan ikke være lengre enn 63 tegn',

          'infoBox.title': 'Hvordan fungerer skjemaet?',
          'infoBox.p1':
            'Dette skjemaet lar deg opprette eller redigere catalog-info.yaml-filer som Backstage bruker for å oppdage og administrere komponenter. Oppgi enten URL til et GitHub-repository for å legge det til i utviklerportalen, eller en lenke til en eksisterende fil for å redigere den.',
          'infoBox.p2':
            'Når du er ferdig, klikker du Opprett Pull Request for å foreslå endringer i repositoryet. Endringene gjelder først når pull request-en er slått sammen og katalogen er oppdatert.',
          'infoBox.subtitle': 'Hva er entiteter i Backstage?',
          'infoBox.p3':
            'Utviklerportalen er bygget med Backstage, som definerer et sett med entiteter som brukes til å bygge programvarekatalogen.',
          'infoBox.systemTitle': 'System',
          'infoBox.systemParagraph':
            'Et system er en samling av komponenter som sammen løser et tydelig formål. Systemet kan bestå av flere komponenter som samarbeider for å levere en funksjonalitet.',
          'infoBox.componentTitle': 'Component',
          'infoBox.componentParagraph':
            'En komponent er en selvstendig del av et system – for eksempel en tjeneste, et bibliotek eller en app. Den har ofte sitt eget repository og kan utvikles, bygges og deployes uavhengig av andre deler av systemet.',
          'infoBox.APITitle': 'API',
          'infoBox.APIParagraph':
            'Et API beskriver grensesnittet en komponent tilbyr eller bruker, og viser hvordan systemer og komponenter kommuniserer. Definisjonsfeltet for API-er er påkrevd.',
          'infoBox.APIremark':
            'Merk: Eksterne API-er skal registreres som Resource, ikke som et API.',
          'infoBox.resourceTitle': 'Resource',
          'infoBox.resourceParagraph':
            'En Resource er en ekstern eller delt ressurs som et system eller en komponent er avhengig av, men som ikke nødvendigvis eies av samme team. Dette kan være teknisk infrastruktur eller eksterne integrasjoner.',
          'infoBox.linkText': 'Les mer om entiteter i din organisasjon ',
          'infoBox.linkText2':
            'Les mer om entiteter i Backstage-dokumentasjonen ',

          'successPage.successfullyCreatedPR': 'Opprettet en pull request: ',
          'successPage.couldNotRetrieveURL':
            'Klarte ikke hente URL for pull request.',
          'successPage.registerNew': 'Registrer en ny component?',
        },
      }),
  },
});
