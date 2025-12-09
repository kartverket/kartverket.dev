import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Box, Card } from '@backstage/ui';
import Link from '@material-ui/core/Link';
import Divider from '@mui/material/Divider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import style from '../../catalog.module.css';

interface EditOrGenerateCatalogInfoBoxProps {
  docsLink?: string;
}

export const EditOrGenerateCatalogInfoBox = ({
  docsLink,
}: EditOrGenerateCatalogInfoBoxProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  return (
    <Card>
      <Box px="2rem">
        <h2>{t('infoBox.title')}</h2>
        <Divider sx={{ marginY: '1.5rem' }} />
        <p>{t('infoBox.p1')}</p>
        <p>{t('infoBox.p2')}</p>
        <Divider />
        <h2> {t('infoBox.subtitle')}</h2>
        <p>{t('infoBox.p3')}</p>
        <h4>{t('infoBox.componentTitle')}</h4>{' '}
        <p>{t('infoBox.componentParagraph')}</p>
        <h4>{t('infoBox.APITitle')}</h4>
        <p>{t('infoBox.APIParagraph')}</p>
        <h4>{t('infoBox.resourceTitle')}</h4>
        <p>{t('infoBox.resourceParagraph')}</p>
        {docsLink && (
          <div className={style.learnMoreLink}>
            <Link href={docsLink}>{t('infoBox.linkText')}</Link>
          </div>
        )}
        <div className={style.learnMoreLink}>
          <Link
            href="https://backstage.io/docs/features/software-catalog/"
            target="_blank"
            rel="noreferrer"
          >
            {t('infoBox.linkText2')}
            <OpenInNewIcon fontSize="inherit" />
          </Link>
        </div>
      </Box>
    </Card>
  );
};
