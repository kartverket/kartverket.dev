import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';

export const supportMessages = {
  title: 'Support',
  openEntry: 'Open',
  entries: {
    developerPortalFeedbackChannel: {
      title: 'Kartverket.dev Feedback Channel',
      description: '#utviklerportal',
    },
    sikkerhetsmetrikker: {
      title: 'Security Metrics Feedback Channel',
      description: '#sikkerhetsmetrikker-tilbakemelding',
    },
    skipdok: {
      title: 'SKIPDOK',
      description: 'Link to documentation',
    },
  },
  feedbackDialog: {
    title: 'Give us your feedback!',
    description: 'Your feedback',
    remark:
      'Do not write any sensitive information or any information about the content in your developer portal. Only provide feedback about the general user experience.',
    confirmationMessage: 'Thank you for your feedback.',
    feedbackButton: 'Give feedback',
    errorMessage: 'An error occurred while sending your feedback.',
    sendButton: 'Send',
  },
  close: 'Close',
  cancel: 'Cancel',
} as const;

export const supportTranslationRef = createTranslationRef({
  id: 'support',
  messages: supportMessages,
});

export const supportNorwegianTranslation = createTranslationResource({
  ref: supportTranslationRef,
  translations: {
    no: () =>
      Promise.resolve({
        default: {
          title: 'Support',
          openEntry: 'Åpne',
          'entries.developerPortalFeedbackChannel.title':
            'Kartverket.dev tilbakemeldingskanal',
          'entries.developerPortalFeedbackChannel.description':
            '#utviklerportal',
          'entries.sikkerhetsmetrikker.title':
            'Sikkerhetsmetrikker tilbakemeldingskanal',
          'entries.sikkerhetsmetrikker.description':
            '#sikkerhetsmetrikker-tilbakemelding',
          'entries.skipdok.title': 'Kartverket.dev tilbakemeldingskanal',
          'entries.skipdok.description': 'Lenke til dokumentasjon',
          'feedbackDialog.title': 'Gi oss en tilbakemelding!',
          'feedbackDialog.remark':
            'Ikke skriv sensitiv informasjon eller informasjon om inneholdet i din utviklerportal. Bare gi tilbakemeldinger på den generelle brukeropplevelsen.',
          'feedbackDialog.description': 'Din tilbakemelding',
          'feedbackDialog.confirmationMessage': 'Takk for din tilbakemelding.',
          'feedbackDialog.feedbackButton': 'Gi tilbakemelding',
          'feedbackDialog.errorMessage': 'Kunne ikke sende tilbakemelding.',
          'feedbackDialog.sendButton': 'Send',
          close: 'Lukk',
          cancel: 'Avbryt',
        },
      }),
  },
});
