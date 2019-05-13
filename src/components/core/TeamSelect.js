import React, { Fragment } from 'react';
import Typeahead from './Typeahead';
import { fetchTeams } from '../../apis/core';

const fields = {
  name: 'name',
  localName: 'localName',
};

const searchTeams = (field, value) =>
  fetchTeams({
    q: Object.keys(fields)
      .filter(searchField => !field || searchField === field)
      .map(field => `${field} =* "${value}"`)
      .join(' OR '),
    limit: 25,
  }).then(({ teams, error, nextPageToken }) => ({
    suggestions: teams || [],
    error,
    nextPageToken,
  }));

const teamToValue = team => team.name;

const splitTeamName = team => {
  const [local, ...parents] = team.name.split('::').reverse();
  return [parents.reverse().join('::'), local];
};

const SearchStatus = props => (
  <Fragment>
    {props.searchField && (
      <div className="status info">
        Find Teams by {fields[props.searchField]}
        <button
          className="btn btn-sm "
          onClick={props.setSearchField(null, props.value)}
        >
          <i className="fa fa-fw fa-remove" />
        </button>
      </div>
    )}
    {(props.error || props.more || props.empty) && (
      <div className="status warning">
        <i className="fa fa-fw fa-exclamation-triangle" />
        {props.error && props.error.key === 'too_many_matches'
          ? 'Too many teams to display. Please refine your search below'
          : props.more
          ? 'Too many teams, first 25 shown. Please refine your search.'
          : props.empty && !props.custom
          ? 'No matching teams.'
          : 'There was an error fetching teams.'}
      </div>
    )}
  </Fragment>
);

const SearchActions = props =>
  props.error && props.error.key === 'too_many_matches' ? (
    <ul className="search-actions">
      {Object.entries(props.error.errorData.matches).map(([field, count]) => (
        <li
          className="suggestion"
          key={field}
          role="button"
          tabIndex={0}
          onClick={props.setSearchField(field, props.value)}
        >
          <i className="fa fa-fw fa-search" />
          <span>
            See <strong>{fields[field]}</strong> results for "{props.value}"
          </span>
          <span className="count">{count}</span>
        </li>
      ))}
    </ul>
  ) : null;

const Selection = ({ selection, edit, remove }) => {
  const [parent, local] = splitTeamName(selection);
  return (
    <div className={`selection ${remove ? 'multi' : ''}`}>
      <div>
        {parent && <div className="small">{parent}</div>}
        <div className="large">{local}</div>
      </div>
      {edit ? (
        <button className="btn btn-sm btn-subtle" onClick={edit}>
          <i className="fa fa-fw fa-pencil" />
        </button>
      ) : (
        <button className="btn btn-sm btn-danger" onClick={remove}>
          <i className="fa fa-fw fa-times" />
        </button>
      )}
    </div>
  );
};

const Suggestion = ({ suggestion, active }) => {
  const [parent, local] = splitTeamName(suggestion);
  return (
    <div className={`suggestion ${active ? 'active' : ''}`}>
      {parent && <div className="small">{parent}</div>}
      <div className="large">{local}</div>
    </div>
  );
};

const TeamSelect = props => (
  <Typeahead
    components={{
      Selection,
      Suggestion,
      ...props.components,
      SearchStatus,
      SearchActions,
    }}
    textMode={props.textMode}
    multiple={props.multiple}
    search={searchTeams}
    getSuggestionValue={teamToValue}
  />
);

export default TeamSelect;
