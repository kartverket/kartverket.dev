import { CustomTooltip } from './LightTooltip';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import style from './securityCard.module.css';

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
            className={style.item}
          >
            <Alert severity="warning">
              <Typography>Missing security champion</Typography>
            </Alert>
            <CustomTooltip
              className={style.toolTip}
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
