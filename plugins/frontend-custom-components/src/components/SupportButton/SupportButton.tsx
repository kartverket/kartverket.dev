import { useState } from 'react';
import { Button, Flex } from '@backstage/ui';
import SupportDialog from './SupportDialog';
import SupportEntry from './SupportEntry';
import style from './support.module.css';
import 'remixicon/fonts/remixicon.css';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { supportTranslationRef } from './supportTranslations';

export const SupportButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslationRef(supportTranslationRef);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        iconStart={<i className="ri-question-line" />}
      >
        Support
      </Button>
      <SupportDialog
        isOpen={open}
        onClick={() => setOpen(false)}
        header={t('title')}
        className={style.supportDialog}
      >
        <Flex direction="column" gap="8px">
          <SupportEntry
            label={t('entries.developerPortalFeedbackChannel.title')}
            url="https://kartverketgroup.slack.com/archives/C06GMG28G8Z"
            icon={
              <i className="ri-slack-fill" style={{ fontSize: 'x-large' }} />
            }
            description={t(
              'entries.developerPortalFeedbackChannel.description',
            )}
          />
          <SupportEntry
            label={t('entries.sikkerhetsmetrikker.title')}
            url="https://kartverketgroup.slack.com/archives/C07RNB2LPUZ"
            icon={
              <i className="ri-slack-fill" style={{ fontSize: 'x-large' }} />
            }
            description={t('entries.sikkerhetsmetrikker.description')}
          />
          <SupportEntry
            label={t('entries.skipdok.title')}
            url="https://skip.kartverket.no/docs"
            icon={
              <i className="ri-article-line" style={{ fontSize: 'x-large' }} />
            }
            description={t('entries.skipdok.description')}
          />
        </Flex>
      </SupportDialog>
    </>
  );
};
