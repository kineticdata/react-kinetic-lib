import React, { Fragment } from 'react';
import { KineticLib } from '@kineticdata/react';
// import 'bootstrap/scss/bootstrap.scss';
// import 'font-awesome/css/font-awesome.css';

// Mock the bundle object.
window.bundle = window.bundle || {};
window.bundle.apiLocation = '/fake-api';

export default ({ children }) => (
  <Fragment>
    <KineticLib>{children}</KineticLib>
  </Fragment>
);
