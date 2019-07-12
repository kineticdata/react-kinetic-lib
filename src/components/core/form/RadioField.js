import React from 'react';

export const RadioField = props =>
  props.visible && (
    <div className="field">
      <legend>{props.label}</legend>
      {props.options.map(option => (
        <label key={option.value}>
          <input
            name={props.name}
            type="radio"
            value={option.value}
            checked={props.value === option.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
