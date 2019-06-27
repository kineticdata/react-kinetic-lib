import React from 'react';

export const PasswordField = props =>
  props.visible && (
    <div className="field">
      <label htmlFor={props.id || props.name}>{props.label}</label>
      <input
        type="password"
        id={props.id || props.name}
        name={props.name}
        value={props.value || ''}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onFocus={props.onFocus}
      />
    </div>
  );
