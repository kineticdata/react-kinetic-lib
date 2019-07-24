import React from 'react';
import t from 'prop-types';

const FooterRow = ({ cells }) => <tr>{cells}</tr>;

FooterRow.propTypes = {
  /** Contains the rendered cells for the table footer row. */
  cells: t.arrayOf(t.object),
};

export default FooterRow;
