import { TextField, Button, Box, Flex, Text } from '@backstage/ui';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import style from '../../catalog.module.css';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import Link from '@material-ui/core/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface RepositoryFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disableTextField: boolean;
  docsLink?: string;
}

export const RepositoryForm = ({
  url,
  onUrlChange,
  onSubmit,
  disableTextField,
  docsLink,
}: RepositoryFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  return (
    <form onSubmit={onSubmit}>
      <Box className={style.infoText}>
        <Flex align="center" gap="sm">
          <EditDocumentIcon className={style.icon} />
          <Text>{t('formInfo.p1')}</Text>
        </Flex>
        <Flex direction="column" className={style.learnMoreLinks}>
          <div>
            {docsLink && (
              <div className={style.learnMoreLink}>
                <Link href={docsLink}>{t('formInfo.linkText')}</Link>
              </div>
            )}
            <div className={style.learnMoreLink}>
              <Link
                href="https://backstage.io/docs/features/software-catalog/"
                target="_blank"
                rel="noreferrer"
              >
                {t('formInfo.linkText2')}
                <OpenInNewIcon fontSize="inherit" />
              </Link>
            </div>
          </div>
        </Flex>
      </Box>
      <Box>
        <Flex align="end">
          <div style={{ flexGrow: 1 }}>
            <TextField
              label={t('repositorySearch.label')}
              size="small"
              placeholder={t('repositorySearch.placeholder')}
              name="url"
              value={url}
              onChange={onUrlChange}
              isDisabled={disableTextField}
            />
          </div>
          <Button type="submit"> {t('repositorySearch.fetchButton')} </Button>
        </Flex>
      </Box>
    </form>
  );
};
