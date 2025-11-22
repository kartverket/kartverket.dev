import { CustomTooltip } from './LightTooltip';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
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

  return (
    <>
      {reposWithNoSecChamps.length > 0 ? (
        <ListItem>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              '@container securityChampionList (max-width: 500px)': {
                flexDirection: 'column',
                alignItems: 'baseline',
              },
            }}
            width="100%"
            justifyContent="space-between"
            divider={
              <Divider
                flexItem
                sx={{
                  orientation: 'horisontal',
                  '@container securityChampionList (max-width: 500px)': {
                    orientation: 'vertical',
                  },
                }}
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
                    ? `${reposWithNoSecChamps.length} components`
                    : `${reposWithNoSecChamps.length} component`}
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
