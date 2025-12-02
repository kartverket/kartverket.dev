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

export const AutocompleteField = (
  props: AutocompleteFieldProps | EntityAutocompleteFieldProps,
) => {
  const { value, onChange, onBlur, placeholder, freeSolo } = props;

  if (props.type === 'select') {
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
  }

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
        const names = newValue?.metadata?.name ?? '';
        onChange(names);
      }}
      options={props.entities || []}
      getOptionLabel={option => {
        return option.metadata.name;
      }}
      filterOptions={(optionList, state) => {
        const inputValue = state.inputValue.toLowerCase();
        return optionList.filter(option => {
          const name = option.metadata.name.toLowerCase();
          const title = (option.metadata.title ?? '').toLowerCase();
          return name.includes(inputValue) || title.includes(inputValue);
        });
      }}
      renderOption={(optionprops, option) => {
        const label = option.metadata.title ?? option.metadata.name;
        return <li {...optionprops}>{label}</li>;
      }}
      isOptionEqualToValue={(option, selectedValue) => {
        return option.metadata.name === selectedValue.metadata.name;
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
};
