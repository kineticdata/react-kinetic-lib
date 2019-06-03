import React from 'react';
import UserSelect from '../UserSelect';

export const UserField = props =>
  props.visible && (
    <div className="field">
      <label htmlFor={props.id || props.name}>{props.label}</label>
      <UserSelect
        textMode
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
      />
    </div>
  );
