import React from 'react';
import t from 'prop-types';

const TableLayout = ({ header, body, footer }) => (
  <table>
    {header}
    {body}
    {footer}
  </table>
);

TableLayout.propTypes = {
  /** Contains the rendered table header. */
  header: t.object,
  /** Contains the rendered table body. */
  body: t.object.isRequired,
  /** Contains the rendered table footer. */
  footer: t.object,
};

export default TableLayout;
