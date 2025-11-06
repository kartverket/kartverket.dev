import { CustomTooltip } from './LightTooltip';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { useMediaQuery } from '@mui/system';
import Stack from '@mui/material/Stack';

type MissingReposItemProps = {
  reposWithSecChamps: string[];
  allRepositories: string[];
};

export const MissingReposItem = ({
  reposWithSecChamps,
  allRepositories,
}: MissingReposItemProps) => {
  const reposWithNoSecChamps: string[] = allRepositories.filter(
    repositoryName => !reposWithSecChamps.includes(repositoryName),
  );
  const isSmallScreen = useMediaQuery('(max-width: 1500px)');

  return (
    <>
      {reposWithNoSecChamps.length > 0 ? (
        <ListItem>
          <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            width="100%"
            justifyContent="space-between"
            divider={
              <Divider
                orientation={isSmallScreen ? 'vertical' : 'horizontal'}
                flexItem
              />
            }
          >
            <Alert severity="warning">
              <Typography>Missing security champion</Typography>
            </Alert>
            <CustomTooltip
              sx={{
                backgroundColor: 'var(--bui-bg-surface-1	)',
              }}
              title={
                <List>
                  {reposWithNoSecChamps.map(repository => (
                    <ListItem key={repository}>
                      <Link
                        href={`/catalog/default/component/${repository}`}
                        target="_blank"
                      >
                        {repository}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              }
            >
              <IconButton color="primary">
                <Typography variant="body1">
                  {reposWithNoSecChamps.length > 1
                  ? `${reposWithNoSecChamps.length} repositories`
                  : `${reposWithNoSecChamps.length} repository`}
                </Typography>
              </IconButton>
            </CustomTooltip>
          </Stack>
        </ListItem>
      ) : (
        <></>
      )}
    </>
  );
};
