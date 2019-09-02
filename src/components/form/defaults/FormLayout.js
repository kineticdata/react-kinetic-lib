import React, { Fragment } from 'react';

export const FormLayout = props => (
  <Fragment>
    {props.fields.toList()}
    {props.error}
    {props.buttons}
  </Fragment>
);
