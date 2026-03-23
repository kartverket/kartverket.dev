import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { makeStyles } from 'tss-react/mui';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { EntityData } from './types';
import { Link } from '@backstage/core-components';
import WarningOutlined from '@mui/icons-material/WarningAmberOutlined';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionPageTranslationRef } from '../../utils/translations';

// Subtle background tint per nesting depth so hierarchy reads at a glance
const depthBackgrounds = [
  undefined,
  'rgba(0, 0, 0, 0.015)',
  'rgba(0, 0, 0, 0.03)',
  'rgba(0, 0, 0, 0.045)',
];

function shortOwnerName(owner: string): string {
  const slashIdx = owner.lastIndexOf('/');
  return slashIdx >= 0 ? owner.slice(slashIdx + 1) : owner;
}

const useStyles = makeStyles()(theme => ({
  // Remove MUI TreeItem's default hover/selected backgrounds — hover is on the card instead
  treeContent: {
    padding: '0 !important',
    paddingLeft: '0 !important',
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    '&[data-focused]': {
      backgroundColor: 'transparent !important',
    },
    '&[data-selected]': {
      backgroundColor: 'transparent !important',
    },
    '&[data-selected][data-focused]': {
      backgroundColor: 'transparent !important',
    },
  },
  // Prevent TreeItemLabel's overflow:hidden from clipping the card's box-shadow
  treeLabel: {
    overflow: 'visible !important',
  },
  // Circle pill around the expand/collapse chevron
  iconContainer: {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
    flexShrink: 0,
    '& svg': {
      fontSize: '1.1rem',
      backgroundColor: theme.palette.action.hover,
      borderRadius: '50%',
      width: 28,
      height: 28,
      padding: 4,
      boxSizing: 'border-box' as const,
    },
  },
  // The visible card box for each item
  card: {
    width: '100%',
    padding: theme.spacing(1.5, 2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    transition: 'box-shadow 150ms ease',
    boxSizing: 'border-box' as const,
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap' as const,
  },
  chip: {
    marginBottom: 0,
    marginRight: 0,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.link ?? theme.palette.primary.main,
    },
  },
  // Flex column with gap so sibling cards breathe
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(1),
  },
  // Vertical connector line tying children to their parent
  nestedGroup: {
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderLeft: `2px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(1),
  },
  warningChip: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    marginBottom: 0,
    marginRight: 0,
  },
}));

function FunctionTreeItems({
  parentRef,
  funcMap,
  classes,
  depth = 0,
  visited = new Set<string>(),
  expiredMap,
}: {
  parentRef: string;
  funcMap: Map<string | undefined, EntityData[]>;
  classes: ReturnType<typeof useStyles>['classes'];
  depth?: number;
  visited?: Set<string>;
  expiredMap?: Map<string, boolean>;
}) {
  const { t } = useTranslationRef(functionPageTranslationRef);
  const children = funcMap.get(parentRef) ?? [];
  const bgColor =
    depthBackgrounds[Math.min(depth, depthBackgrounds.length - 1)];

  return (
    <div className={classes.itemsContainer}>
      {children.map(child => {
        if (child.ref !== undefined && visited.has(child.ref)) return null;
        const childVisited = new Set(visited);
        if (child.ref !== undefined) childVisited.add(child.ref);
        const hasChildren =
          child.ref !== undefined && (funcMap.get(child.ref)?.length ?? 0) > 0;
        return (
          <TreeItem
            key={child.ref ?? child.title}
            itemId={child.ref ?? child.title}
            classes={{
              content: classes.treeContent,
              label: classes.treeLabel,
              iconContainer: classes.iconContainer,
            }}
            label={
              <Paper
                className={classes.card}
                elevation={1}
                style={bgColor ? { backgroundColor: bgColor } : undefined}
              >
                <span className={classes.labelRow}>
                  <Link
                    className={classes.link}
                    to={`/catalog/${child.namespace}/${child.kind.toLowerCase()}/${child.name}`}
                    onClick={e => e.stopPropagation()}
                    style={{ fontWeight: hasChildren ? 600 : undefined }}
                  >
                    {child.title}
                  </Link>
                  {child.owner && (
                    <Chip
                      className={classes.chip}
                      label={shortOwnerName(child.owner)}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {expiredMap?.get(child.title) && (
                    <Chip
                      icon={
                        <WarningOutlined
                          color="inherit"
                          style={{ paddingLeft: 1 }}
                        />
                      }
                      label={t('functionpage.expiredSecurityForm')}
                      size="small"
                      className={classes.warningChip}
                      variant="outlined"
                    />
                  )}
                </span>
              </Paper>
            }
          >
            {hasChildren && (
              <div className={classes.nestedGroup}>
                <FunctionTreeItems
                  parentRef={child.ref!}
                  funcMap={funcMap}
                  classes={classes}
                  depth={depth + 1}
                  visited={childVisited}
                  expiredMap={expiredMap}
                />
              </div>
            )}
          </TreeItem>
        );
      })}
    </div>
  );
}

export const FunctionTree = ({
  rootRef,
  funcMap,
  defaultExpanded = [],
  expiredMap,
}: {
  rootRef: string;
  funcMap: Map<string | undefined, EntityData[]>;
  defaultExpanded?: string[];
  expiredMap?: Map<string, boolean>;
}) => {
  const { classes } = useStyles();

  return (
    <SimpleTreeView
      slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
      defaultExpandedItems={defaultExpanded}
      itemChildrenIndentation={0}
    >
      <FunctionTreeItems
        parentRef={rootRef}
        funcMap={funcMap}
        classes={classes}
        expiredMap={expiredMap}
      />
    </SimpleTreeView>
  );
};
