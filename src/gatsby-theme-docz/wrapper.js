import React, { Fragment } from 'react';
import { KineticLib } from '../index';

export default ({ children }) => (
  <Fragment>
    <KineticLib>{children}</KineticLib>
  </Fragment>
);
