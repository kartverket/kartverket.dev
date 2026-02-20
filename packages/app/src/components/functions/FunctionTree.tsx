import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Link } from '@backstage/core-components';
import { EntityData } from './FunctionsPageNew2';

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.link?.main ?? theme.palette.primary.main,
    },
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  owner: {
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
  },
  treeItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  nestedGroup: {
    borderLeft: `3px solid ${theme.palette.primary.light}`,
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));



function FunctionTreeItems({
  parentRef,
  funcMap,
  classes,
}: {
  parentRef: string;
  funcMap: Map<String, EntityData[]>;
  classes: ReturnType<typeof useStyles>;
}) {
  const children = funcMap.get(parentRef) ?? [];
  return (
    <>
      {children.map(child => {
        const hasChildren =
          child.ref != null && (funcMap.get(child.ref)?.length ?? 0) > 0;
        return (
          <div key={child.ref ?? child.name} className={classes.treeItem}>
            <TreeItem
              nodeId={child.ref ?? child.name}
              label={
                <span className={classes.labelRow}>
                  <Link
                    className={classes.link}
                    to={`/catalog/${child.namespace}/${child.kind.toLowerCase()}/${child.name}`}
                    onClick={e => e.stopPropagation()}
                  >
                    {child.name}
                  </Link>
                  {child.owner && (
                    <Typography component="span" className={classes.owner}>
                      — {child.owner}
                    </Typography>
                  )}
                </span>
              }
            >
              {hasChildren && (
                <div className={classes.nestedGroup}>
                  <FunctionTreeItems
                    parentRef={child.ref!}
                    funcMap={funcMap}
                    classes={classes}
                  />
                </div>
              )}
            </TreeItem>
          </div>
        );
      })}
    </>
  );
}

export const FunctionTree = ({
  rootRef,
  funcMap,
  defaultExpanded = [],
}: {
  rootRef: string;
  funcMap: Map<String, EntityData[]>;
  defaultExpanded?: string[];
}) => {
  const classes = useStyles();

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={defaultExpanded}
    >
      <FunctionTreeItems
        parentRef={rootRef}
        funcMap={funcMap}
        classes={classes}
      />
    </TreeView>
  );
};
