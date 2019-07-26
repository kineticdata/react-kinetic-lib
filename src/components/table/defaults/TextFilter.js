import React from 'react';
import { I18n } from '../../core/i18n/I18n';

const TextFilter = ({ value, name, title, onChange }) => (
  <div>
    <label htmlFor={`filter-input-${name}`}>
      <I18n>{title}</I18n>:
    </label>

    <input
      type="text"
      name="filter-input"
      id={`filter-input-${name}`}
      value={value.get(0)}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default TextFilter;
