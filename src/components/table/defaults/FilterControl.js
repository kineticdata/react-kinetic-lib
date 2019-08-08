import React from 'react';
import t from 'prop-types';
import { I18n } from '../../core/i18n/I18n';

export const FilterControl = ({ filters, onSearch, columnSet }) => (
  <form onSubmit={onSearch}>
    {filters
      .filter(filter => columnSet.includes(filter.get('column')))
      .map((filter, key) => (
        <div key={key}>
          <label htmlFor={`filter-input-${key}`}>
            <I18n>{filter.get('title')}</I18n>:
          </label>

          <input
            type="text"
            name="filter-input"
            id={`filter-input-${key}`}
            value={filter.get('value')}
            onChange={e => filter.get('onChange')(e.target.value)}
          />
        </div>
      ))}
    <button type="submit">Search</button>
  </form>
);

FilterControl.propTypes = {
  /** The overall rows object, representing visible data in the table. */
  filters: t.object,
  /** The onSearch action to refetch data based on filters. */
  onSearch: t.func,
  /** The table columns object. */
  columnSet: t.object,
};

export default FilterControl;
