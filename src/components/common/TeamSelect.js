import React from 'react';
import { Typeahead } from './Typeahead';
import { fetchTeams } from '../../apis';

const fields = {
  name: 'Full Name',
  localName: 'Local Name',
};

const searchTeams = (field, value, callback) =>
  fetchTeams({
    q: Object.keys(fields)
      .filter(searchField => !field || searchField === field)
      .map(field => `${field} =* "${value}"`)
      .join(' OR '),
    limit: 25,
  })
    .then(({ teams, error, nextPageToken }) => ({
      suggestions: teams || [],
      error,
      nextPageToken,
    }))
    .then(callback);

const teamToValue = team => (team && team.get('name')) || '';

const getStatusProps = props => ({
  meta: props.searchField ? `Find Teams by ${fields[props.searchField]}` : null,
  info: props.short
    ? 'Type to find a team.'
    : props.pending
    ? 'Searching…'
    : null,
  warning:
    props.error || props.more || props.empty
      ? props.error && props.error.key === 'too_many_matches'
        ? 'Too many teams to display. Please refine your search below'
        : props.more
        ? 'Too many teams, first 25 shown. Please refine your search.'
        : props.empty && !props.custom
        ? 'No matching teams.'
        : 'There was an error fetching teams.'
      : null,

  clearFilterField: props.searchField ? props.setSearchField(null) : null,
  filterFieldOptions:
    props.error && props.error.key === 'too_many_matches'
      ? Object.entries(props.error.errorData.matches).map(([field, count]) => ({
          field,
          count,
          label: fields[field],
          value: props.value,
          onClick: props.setSearchField(field),
        }))
      : null,
});

export const TeamSelect = props => (
  <Typeahead
    components={props.components || {}}
    disabled={props.disabled}
    multiple={props.multiple}
    search={searchTeams}
    minSearchLength={props.minSearchLength}
    getSuggestionValue={teamToValue}
    getStatusProps={getStatusProps}
    value={props.value}
    onChange={props.onChange}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
    placeholder={props.placeholder}
  />
);
