import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';

export function TableOfContentsRenderer({
  classes,
  children,
  searchTerm,
  onSearchTermChange,
}) {
  return (
    <aside className="app-body__sidebar col-xs-3 col-lg-2">
      <div className="d-flex search">
        <input
          value={searchTerm}
          className="form-control"
          placeholder="Filter by name"
          aria-label="Filter by name"
          onChange={event => onSearchTermChange(event.target.value)}
        />
      </div>
      <div className="toc">{children}</div>
    </aside>
  );
}

TableOfContentsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  searchTerm: PropTypes.string.isRequired,
  onSearchTermChange: PropTypes.func.isRequired,
};

export default Styled(() => {})(TableOfContentsRenderer);
