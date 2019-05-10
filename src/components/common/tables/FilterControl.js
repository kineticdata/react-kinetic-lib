import React from 'react';
import { I18n } from '../i18n/I18nProvider';

export const FilterControl = ({ filter, handleFilterChange }) => (
  <div className="input-group">
    <div className="input-group-prepend">
      <span className="input-group-text">
        <I18n>Filter</I18n>:
      </span>
    </div>
    <input
      type="text"
      name="filter-input"
      id="filter-input"
      className="form-control"
      value={filter}
      onChange={handleFilterChange}
    />
  </div>
);

export default FilterControl;
