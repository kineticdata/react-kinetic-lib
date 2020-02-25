import React from 'react';
import { PropRow, PropsTable } from '../PropsTable';

export const TableLayoutProps = () => {
  return (
    <PropsTable>
      <PropRow
        description="Resulting element from Header component."
        name="header"
        type="React.Element"
      />
      <PropRow
        description="Resulting element from Body component."
        name="body"
        type="React.Element"
      />
      <PropRow
        description="Resulting element from Footer component."
        name="footer"
        type="React.Element"
      />
      <PropRow
        description="Resulting element from Header component."
        name="initializing"
        type="boolean"
      />
      <PropRow
        description="Resulting element from Header component."
        name="loading"
        type="boolean"
      />
      <PropRow
        description="Resulting element from Header component."
        name="error"
        type="string"
      />
      <PropRow
        description="Resulting element from Header component."
        name="empty"
        type="boolean"
      />
    </PropsTable>
  );
};
