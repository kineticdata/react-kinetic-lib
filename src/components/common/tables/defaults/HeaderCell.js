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

HeaderCell.propTypes = {
  onSortColumn: t.func,
  title: t.string,
  column: t.shape({
    /** The title that will be rendered in the header. */
    title: t.string,
    /** The value key that will be used to map the column to the data object. */
    value: t.string,
    /** Flag that determines if the column can be used as a filter. */
    filterable: t.bool,
    /** Flag that determines if the column is sortable.*/
    sortable: t.bool,
    /** Allows overriding the `HeaderCell`, `BodyCell`, and `FooterCell` for a given column. */
    components: t.shape({
      HeaderCell: t.func,
      BodyCell: t.func,
      FooterCell: t.func,
    }),
  }),
  sortColumn: t.shape({
    /** The title that will be rendered in the header. */
    title: t.string,
    /** The value key that will be used to map the column to the data object. */
    value: t.string,
    /** Flag that determines if the column can be used as a filter. */
    filterable: t.bool,
    /** Flag that determines if the column is sortable.*/
    sortable: t.bool,
    /** Allows overriding the `HeaderCell`, `BodyCell`, and `FooterCell` for a given column. */
    components: t.shape({
      HeaderCell: t.func,
      BodyCell: t.func,
      FooterCell: t.func,
    }),
  }),
  sortDirection: t.string,
  rows: t.arrayOf(t.object),
};

export default HeaderCell;
