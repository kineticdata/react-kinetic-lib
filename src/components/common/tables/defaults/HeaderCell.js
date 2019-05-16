import React from 'react';
import t from 'prop-types';
import { I18n } from '../../../core/i18n/I18n';

const HeaderCell = ({ onSortColumn, column, title }) => (
  <th {...(title ? { scope: 'col' } : {})}>
    {column.sortable === false ? (
      <I18n>{title}</I18n>
    ) : (
      <a onClick={onSortColumn}>
        <I18n>{title}</I18n>
      </a>
    )}
  </th>
);

export default HeaderCell;
