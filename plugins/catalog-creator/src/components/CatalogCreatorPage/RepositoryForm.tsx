import { TextField, Button, Box, Flex } from '@backstage/ui';

interface RepositoryFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RepositoryForm = ({
  url,
  onUrlChange,
  onSubmit,
}: RepositoryFormProps) => (
  <form onSubmit={onSubmit}>
    <Box px="2rem">
      <Flex align="end">
        <div style={{ flexGrow: 1 }}>
          <TextField
            label="Repository URL"
            size="small"
            placeholder="Enter a URL"
            name="url"
            value={url}
            onChange={onUrlChange}
          />
        </div>
        <Button type="submit">Fetch!</Button>
      </Flex>
    </Box>
  </form>
);
