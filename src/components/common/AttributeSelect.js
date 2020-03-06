import React from 'react';
import { Typeahead } from './Typeahead';

const searchOptions = ({ options }) => (field, value) =>
  Promise.resolve({
    suggestions: options
      .filter(attribute =>
        attribute
          .get('name', '')
          .toLowerCase()
          .includes(value.toLowerCase()),
      )
      .toArray(),
  });

const optionToLabel = option => (option && option.get('name')) || '';

const optionToValue = option => (option && option.get('name')) || '';

const getStatusProps = props => ({
  warning:
    props.error || props.empty || props.more
      ? props.error
        ? props.error
        : props.more
        ? 'Too many results, first 50 shown. Please refine your search.'
        : props.empty
        ? 'No matches found.'
        : null
      : null,
});

export const AttributeSelect = props => (
  <Typeahead
    components={props.components || {}}
    textMode
    search={searchOptions(props)}
    alwaysRenderSuggestions
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
