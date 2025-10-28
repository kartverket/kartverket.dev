import { Card, Box, Flex } from '@backstage/ui';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

interface SuccessMessageProps {
  prUrl?: string;
  onReset: () => void;
}

export const SuccessMessage = ({ prUrl, onReset }: SuccessMessageProps) => (
  <Card>
    <Box px="2rem">
      <Flex direction="column" align={{ xs: 'start', md: 'center' }} py="2rem">
        <Alert
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
          severity="success"
        >
          Successfully created a pull request:{' '}
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
            <p>Could not retrieve pull request URL.</p>
          )}
        </Alert>
        <Link color="inherit" onClick={onReset}>
          Register a new component?
        </Link>
      </Flex>
    </Box>
  </Card>
);
