import { TextField, Button, Box, Flex } from '@backstage/ui';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../utils/translations';

interface RepositoryFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disableTextField: boolean;
}

export const RepositoryForm = ({
  url,
  onUrlChange,
  onSubmit,
  disableTextField,
}: RepositoryFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  return (
    <form onSubmit={onSubmit}>
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
    </form>
  );
};
