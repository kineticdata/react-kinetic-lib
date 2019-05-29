import React from 'react';
import t from 'prop-types';

const Footer = ({ footerRow }) => <tfoot>{footerRow}</tfoot>;

Footer.propTypes = {
  /** The overall rows object, representing visible data in the table. */
  rows: t.arrayOf(t.object),
  /** The rendered footer row. */
  footerRow: t.object,
};
export default Footer;
