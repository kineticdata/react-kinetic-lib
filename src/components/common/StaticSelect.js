import React from 'react';
import { Typeahead } from './Typeahead';
import { List, Map } from 'immutable';

const fields = [{ name: 'label' }, { name: 'value' }];

const searchOptions = ({ allowNew, options, search }) => (field, value) => {
  const searchFields =
    Map.isMap(search) && search.has('fields') && !search.get('fields').isEmpty()
      ? search.get('fields').toJS()
      : fields;

  // Static Options
  if (List.isList(options) && (allowNew || !options.isEmpty())) {
    const filter =
      typeof search === 'function'
        ? search
        : (options, value) =>
            options.filter(option =>
              searchFields.some(
                field =>
                  option[field.name] &&
                  (field.exact
                    ? option[field.name] === value
                    : option[field.name]
                        .toLowerCase()
                        .includes(value.toLowerCase())),
              ),
            );
    return Promise.resolve({ suggestions: filter(options.toJS(), value) });
  }
  // Server Side Fetching
  else {
    return Promise.resolve({
      error: 'No options provided.',
      suggestions: [],
    });
  }
};

const optionToLabel = option => (option && option.get('label')) || '';

const optionToValue = option => (option && option.get('value')) || '';

const valueToCustomOption = value => ({ value, label: value });

const getStatusProps = props => ({
  warning:
    props.error || props.empty
      ? props.error
        ? props.error
        : props.empty
        ? 'No matches found.'
        : null
      : null,
});

export const StaticSelect = ({ alwaysRenderSuggestions = true, ...props }) => (
  <Typeahead
    components={props.components || {}}
    textMode={props.textMode}
    multiple={props.multiple}
    custom={props.allowNew && valueToCustomOption}
    search={searchOptions(props)}
    minSearchLength={props.minSearchLength}
    alwaysRenderSuggestions={alwaysRenderSuggestions}
    getSuggestionLabel={optionToLabel}
    getSuggestionValue={optionToValue}
    getStatusProps={getStatusProps}
    value={props.value}
    onChange={props.onChange}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
    placeholder={props.placeholder}
  />
);
