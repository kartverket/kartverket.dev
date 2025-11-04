import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Box, Card } from '@backstage/ui';
import Link from '@material-ui/core/Link';
import Divider from '@mui/material/Divider';
import { catalogCreatorTranslationRef } from '../../utils/translations';

export const EditOrGenerateCatalogInfoBox = () => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  return (
    <Card>
      <Box px="2rem">
        <h2>{t('infoBox.title')}</h2>
        <Divider sx={{ marginY: '1.5rem' }} />
        <p>{t('infoBox.p1')}</p>
        <p>{t('infoBox.p2')}</p>
        <Divider />
        <h3> {t('infoBox.subtitle')}</h3>
        <p>{t('infoBox.p3')}</p>
        <h4>{t('infoBox.componentTitle')}</h4>{' '}
        <p>{t('infoBox.componentParagraph')}</p>
        <h4>{t('infoBox.APITitle')}</h4>
        <p>{t('infoBox.APIParagraph')}</p>
        <h4>{t('infoBox.resourceTitle')}</h4>
        <p>{t('infoBox.resourceParagraph')}</p>
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <Link
            href="https://backstage.io/docs/features/software-catalog/"
            target="_blank"
            rel="noreferrer"
          >
            {t('infoBox.linkText')}
          </Link>
        </div>
      </Box>
    </Card>
  );
};
