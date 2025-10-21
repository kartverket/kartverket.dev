import { FocusEventHandler, useState } from 'react';

import { Entity } from '@backstage/catalog-model';
import { SearchField } from '@backstage/ui';
import { List, ListItemText, Paper } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';

interface CatalogSearchProps {
  value: string | undefined;
  entityList: Entity[];
  onChange: (entity: string | null) => void;
  onBlur: () => void;

 
  
}

export const CatalogSearch = ({
  onChange,
  entityList,
  value,
  onBlur,
}: CatalogSearchProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEntities =
    value !== undefined
      ? entityList.filter(({ metadata }) => {
          const titleOrName = metadata.title ?? metadata.name;
          return titleOrName.toLowerCase().includes(value.toLowerCase());
        })
      : entityList;

  const handleOnBlur: FocusEventHandler<HTMLDivElement> = () => {
    setShowDropdown(false);
    if (value && entityList.some(({ metadata: { name } }) => name === value)) {
      onChange(value);
    } else {
      onChange('');
    }
    onBlur();
  };

  const handleFocus = () => {
    setShowDropdown(true);
    onChange('');
  };

  return (
    <div
      onFocus={handleFocus}
      onBlur={handleOnBlur}
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div style={{ position: 'relative', overflow: 'visible' }}>
        <SearchField
          placeholder="Search..."
          value={value}
          onChange={input => {
            onChange(input);
          }}
        />

        {showDropdown && filteredEntities.length > 0 ? (
          <Paper
            style={{
              maxHeight: 300,
              overflowY: 'auto',
              margin: '2px',
              position: 'absolute',
              zIndex: 1,
              width: '100%',
            }}
          >
            <List>
              {filteredEntities.map(entity => (
                <ListItemButton
                  key={entity.metadata.name}
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
                    e.stopPropagation();
                    onChange(entity.metadata.name);
                    setShowDropdown(false);
                    onBlur();
                  }}
                >
                  <ListItemText
                    primary={entity.metadata.title ?? entity.metadata.name}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CatalogSearch;
