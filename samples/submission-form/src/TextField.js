import React from 'react';

export const TextField = props =>
  props.visible && (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              id={props.id}
              name={props.name}
              value={props.value}
              onBlur={props.onBlur}
              onChange={props.onChange}
              onFocus={props.onFocus}
              placeholder={props.placeholder}
              disabled={!props.enabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
