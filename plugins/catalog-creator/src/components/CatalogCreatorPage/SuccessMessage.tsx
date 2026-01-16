import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Card, Box, Flex } from '@backstage/ui';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { catalogCreatorTranslationRef } from '../../utils/translations';

import style from '../../catalog.module.css';

interface SuccessMessageProps {
  prUrl?: string;
  onReset: () => void;
}

export const SuccessMessage = ({ prUrl, onReset }: SuccessMessageProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  return (
    <Card>
      <Box px="2rem">
        <Flex
          direction="column"
          align={{ xs: 'start', md: 'center' }}
          py="2rem"
        >
          <Alert className={style.successAlert} severity="success">
            {t('successPage.successfullyCreatedPR')}:{' '}
            {prUrl ? (
              <Link
                href={prUrl}
                sx={{ fontWeight: 'normal' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {prUrl}
              </Link>
            ) : (
              <p>{t('successPage.couldNotRetrieveURL')}</p>
            )}
          </Alert>
          <Link color="inherit" onClick={onReset}>
            {t('successPage.registerNew')}
          </Link>
        </Flex>
      </Box>
    </Card>
  );
};
