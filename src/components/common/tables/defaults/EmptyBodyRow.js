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

export default EmptyBodyRow;
