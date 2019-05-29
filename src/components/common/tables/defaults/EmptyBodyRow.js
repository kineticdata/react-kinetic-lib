import React from 'react';
import t from 'prop-types';
import { I18n } from '../../../core/i18n/I18n';

const EmptyBodyRow = ({ columns, emptyMessage }) => (
  <tr>
    <td className="text-center" colSpan={columns.size}>
      <em>
        <I18n>{emptyMessage}</I18n>
      </em>
    </td>
  </tr>
);

EmptyBodyRow.propTypes = {
  /** The columns configuration array. */
  columns: t.arrayOf(t.object),
  /** The overall rows object, representing visible data in the table. */
  rows: t.arrayOf(t.object),
  /** The message to be rendered when there are no rows to render. */
  emptyMessage: t.string,
};

export default EmptyBodyRow;
