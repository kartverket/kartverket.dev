import { TextField, Button, Box, Flex } from '@backstage/ui';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../utils/translations';

interface RepositoryFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RepositoryForm = ({
  url,
  onUrlChange,
  onSubmit,
}: RepositoryFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  return (
    <form onSubmit={onSubmit}>
      <Box px="2rem">
        <Flex align="end">
          <div style={{ flexGrow: 1 }}>
            <TextField
              label={t('repositorySearch.label')}
              size="small"
              placeholder={t('repositorySearch.placeholder')}
              name="url"
              value={url}
              onChange={onUrlChange}
            />
          </div>
          <Button type="submit"> {t('repositorySearch.fetchButton')}</Button>
        </Flex>
      </Box>
    </form>
  );
};
