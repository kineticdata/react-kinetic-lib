import React from 'react';
import t from 'prop-types';

const TableBody = ({ tableRows }) => <tbody>{tableRows}</tbody>;

TableBody.propTypes = {
  loading: t.bool,
  initializing: t.bool,
  tableRows: t.oneOfType([t.array, t.object]).isRequired,
};

export default TableBody;
