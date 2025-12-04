import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { Entity } from '@backstage/catalog-model';

type AutocompleteFieldProps = {
  type: 'select';
  value: string | undefined;
  onChange: any;
  onBlur: any;
  freeSolo?: boolean;
  placeholder: string | undefined;
  options: string[];
};

type EntityAutocompleteFieldProps = {
  type: 'search';
  value?: string | undefined;
  onChange: any;
  onBlur: any;
  freeSolo?: boolean;
  placeholder: string | undefined;
  entities: Entity[];
};

type MultipleEntityAutocompleteFieldProps = {
  type: 'multiple-search';
  value: string[] | undefined;
  onChange: any;
  onBlur: any;
  freeSolo?: boolean;
  placeholder: string | undefined;
  entities: Entity[];
};

export const AutocompleteField = (
  props:
    | AutocompleteFieldProps
    | EntityAutocompleteFieldProps
    | MultipleEntityAutocompleteFieldProps,
) => {
  if (props.type === 'select') {
    const { value, onChange, onBlur, placeholder, freeSolo } = props;

    const options =
      freeSolo && value && !props.options.includes(value)
        ? [...props.options, value]
        : props.options;

    return (
      <Autocomplete
        value={value ? (props.options.find(x => x === value) ?? null) : null}
        onChange={(_, newValue) => {
          onChange(newValue ?? '');
        }}
        onInputChange={(_, newInputValue) => {
          onChange(newInputValue);
        }}
        onBlur={onBlur}
        freeSolo={freeSolo}
        options={options}
        getOptionLabel={option => option}
        size="small"
        renderInput={params => (
          <MuiTextField
            {...params}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              sx: {
                fontSize: '0.85rem',
                fontFamily: 'system-ui',
              },
            }}
          />
        )}
      />
    );
  } else if (props.type === 'search') {
    const { value, onChange, onBlur, placeholder, freeSolo } = props;

    const options: (Entity | string)[] = (() => {
      if (freeSolo && value) {
        const matchesEntity = props.entities.some(
          entity => entity.metadata.name === value,
        );
        return matchesEntity ? props.entities : [...props.entities, value];
      }
      return props.entities;
    })();

    return (
      <Autocomplete
        value={
          value
            ? (props.entities.find(entity => entity.metadata.name === value) ??
              null)
            : null
        }
        onBlur={onBlur}
        onChange={(_, newValue) => {
          const names =
            typeof newValue === 'string'
              ? newValue
              : (newValue?.metadata?.name ?? '');
          onChange(names);
        }}
        onInputChange={(_, newInputValue) => {
          if (freeSolo) {
            onChange(newInputValue);
          }
        }}
        options={options || []}
        getOptionLabel={option => {
          return typeof option === 'string' ? option : option.metadata.name;
        }}
        filterOptions={(optionList, state) => {
          const inputValue = state.inputValue.toLowerCase();
          return optionList.filter(option => {
            if (typeof option === 'string') {
              return option.toLowerCase().includes(inputValue);
            }
            const name = option.metadata.name.toLowerCase();
            const title = (option.metadata.title ?? '').toLowerCase();
            return name.includes(inputValue) || title.includes(inputValue);
          });
        }}
        renderOption={(optionprops, option) => {
          const label =
            typeof option === 'string'
              ? option
              : (option.metadata.title ?? option.metadata.name);
          return <li {...optionprops}>{label}</li>;
        }}
        isOptionEqualToValue={(option, selectedValue) => {
          if (typeof option === 'string' && typeof selectedValue === 'string') {
            return option === selectedValue;
          }
          if (typeof option !== 'string' && typeof selectedValue !== 'string') {
            return option.metadata.name === selectedValue.metadata.name;
          }
          return false;
        }}
        size="small"
        renderInput={params => (
          <MuiTextField
            {...params}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              sx: {
                fontSize: '0.85rem',
                font: 'system-ui',
              },
            }}
          />
        )}
      />
    );
  }
  return null;
};
