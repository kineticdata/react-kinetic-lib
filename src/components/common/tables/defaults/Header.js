import React from 'react';
import t from 'prop-types';

const Header = ({ sorting, headerRow }) => (
  <thead className={sorting ? 'sortable' : ''}>{headerRow}</thead>
);

Header.propTypes = {
  /** A flag that signifies if sorting is enabled or disabled. */
  sorting: t.bool,
  /** Contains the rendered header row component. */
  headerRow: t.object,
};

export default Header;
