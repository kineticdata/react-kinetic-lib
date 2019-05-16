import React from 'react';
import t from 'prop-types';

const BodyCell = ({ index, row, value }) => (
  <td {...(index === 0 ? { scope: 'row' } : {})}>{value}</td>
);

BodyCell.propTypes = {
  /** Represents the column index. */
  index: t.number.isRequired,
  /** The column object used for rendering the current column. */
  column: t.object,
  /** The row object used for rendering the current row. */
  row: t.object,
  /** The value as retrieved by the column configuration. */
  value: t.any,
  /** The overall rows object, representing visible data in the table. */
  rows: t.arrayOf(t.object),
};

export default BodyCell;
