import React from 'react';
import t from 'prop-types';
import { I18n } from '../../../core/i18n/I18n';

const EmptyBodyRow = ({ columns, emptyMessage }) => (
  <tr>
    <td className="text-center" colSpan={columns.length}>
      <em>
        <I18n>{emptyMessage}</I18n>
      </em>
    </td>
  </tr>
);

EmptyBodyRow.propTypes = {
  /** The columns configuration array. */
  columns: t.arrayOf(t.object),
  /** Denotes wherther the table has initialized and loaded its first set of data. */
  initializing: t.bool,
  /** Denotes whether the table is currently loading data. */
  loading: t.bool,
  /** The filter criteria that is being used for the current rows. */
  appliedFilters: t.object,
  /** The message to be rendered when there are no rows to render. */
  emptyMessage: t.string,
};

export default EmptyBodyRow;
