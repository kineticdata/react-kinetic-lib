import React from 'react';
import { I18n } from '../../core/i18n/I18n';

export const DefaultTableLayout = ({ header, body, footer }) => (
  <table>
    {header}
    {body}
    {footer}
  </table>
);

export const DefaultHeader = ({ sorting, headerRow }) => (
  <thead className={sorting ? 'sortable' : ''}>{headerRow}</thead>
);

export const DefaultHeaderRow = ({ columnHeaders }) => <tr>{columnHeaders}</tr>;

export const DefaultHeaderCell = ({ onSortColumn, column, title }) => (
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

export const DefaultTableBody = ({ tableRows }) => <tbody>{tableRows}</tbody>;

export const DefaultTableBodyRow = ({ cells }) => <tr>{cells}</tr>;

export const DefaultEmptyBodyRow = ({ columns, emptyMessage }) => (
  <tr>
    <td className="text-center" colSpan={columns.size}>
      <em>
        <I18n>{emptyMessage}</I18n>
      </em>
    </td>
  </tr>
);

export const DefaultTableBodyCell = ({ index, row, value }) => (
  <td {...(index === 0 ? { scope: 'row' } : {})}>{value}</td>
);

export const DefaultTableFooter = ({ footerRow }) => <tfoot>{footerRow}</tfoot>;

export const DefaultTableFooterRow = ({ cells }) => <tr>{cells}</tr>;

export const DefaultTableFooterCell = () => <td />;
