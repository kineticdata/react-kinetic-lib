import React, { Fragment } from 'react';
import Typeahead from './Typeahead';
import { fetchUsers } from '../../apis/core';

const emailPattern = /^.+@.+\..+$/;

const fields = {
  username: 'Username',
  displayName: 'Display Name',
  email: 'Email',
};

const searchUsers = (searchField, value) =>
  fetchUsers({
    q: Object.keys(fields)
      .filter(field => !searchField || field === searchField)
      .map(field => `${field} =* "${value}"`)
      .join(' OR '),
    limit: 25,
  }).then(({ users, error, nextPageToken }) => ({
    suggestions: users || [],
    error,
    nextPageToken,
  }));

const userToValue = user => user.username || user.email;

const valueToCustomUser = value =>
  value.match(emailPattern) && { email: value };

const SearchStatus = props => (
  <Fragment>
    {props.searchField && (
      <div className="status info">
        Find Users by {fields[props.searchField]}
        <button className="btn btn-sm " onClick={props.setSearchField(null)}>
          <i className="fa fa-fw fa-remove" />
        </button>
      </div>
    )}
    {(props.error || props.more || props.empty) && (
      <div className="status warning">
        <i className="fa fa-fw fa-exclamation-triangle" />
        {props.error && props.error.key === 'too_many_matches'
          ? 'Too many users to display. Please refine your search below'
          : props.more
          ? 'Too many users, first 25 shown. Please refine your search.'
          : props.empty && !props.custom
          ? 'No matching users.'
          : props.empty && props.custom
          ? 'Not matching users. You may also enter a valid email.'
          : 'There was an error fetching users.'}
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
          onClick={props.setSearchField(field)}
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

const Selection = ({ selection, edit, remove }) => (
  <div className={`selection ${remove ? 'multi' : ''}`}>
    <div>
      <div className="large">{selection.displayName || 'New User'}</div>
      <div className="small">{selection.username || selection.email}</div>
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

const Suggestion = ({ suggestion, active }) => (
  <div className={`suggestion ${active ? 'active' : ''}`}>
    <div className="large">{suggestion.displayName || 'New User'}</div>
    <div className="small">{suggestion.username || suggestion.email}</div>
  </div>
);

const UserSelect = props => (
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
    custom={props.allowNew && valueToCustomUser}
    search={searchUsers}
    getSuggestionValue={userToValue}
  />
);

export default UserSelect;
