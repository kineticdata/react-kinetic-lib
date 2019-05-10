import React from 'react';
import { I18n } from '../i18n/I18nProvider';

export const DefaultTableLayout = ({ header, body, footer }) => (
  <table className="table table-sm table-striped">
    {header}
    {body}
    {footer}
  </table>
);

export const DefaultHeader = ({ sorting, headerRow }) => (
  <thead className={sorting ? 'sortable' : ''}>{headerRow}</thead>
);

export const DefaultHeaderRow = ({ columnHeaders }) => <tr>{columnHeaders}</tr>;

export const DefaultHeaderCell = ({
  onSortColumn,
  sortClass,
  sortClick,
  title,
}) => (
  <th
    className={sortClass}
    {...(title ? { scope: 'col' } : {})}
    onClick={sortClick}
  >
    <a onClick={onSortColumn}>
      <I18n>{title}</I18n>
    </a>
  </th>
);

export const DefaultTableBody = ({ tableRows }) => <tbody>{tableRows}</tbody>;

export const DefaultTableBodyRow = ({ cells }) => <tr>{cells}</tr>;

export const DefaultEmptyBodyRow = ({ columns, emptyMessage }) => (
  <tr>
    <td className="text-center" colSpan={columns.length}>
      <em>
        <I18n>{emptyMessage || 'No data found.'}</I18n>
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
