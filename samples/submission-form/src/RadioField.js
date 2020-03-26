import React from 'react';

export const RadioField = props =>
  props.visible && (
    <div className="field is-horizontal">
      <div className="field-label">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field is-narrow">
          <div className="control">
            {props.options.map((option, i) => (
              <label className="radio" key={i}>
                <input
                  ref={i === 0 ? props.focusRef : null}
                  id={`${props.id}-${option.get('value')}`}
                  name={props.name}
                  type="radio"
                  value={option.get('value')}
                  checked={props.value === option.get('value')}
                  onChange={props.onChange}
                  onBlur={props.onBlur}
                  onFocus={props.onFocus}
                />
                &nbsp;
                {option.get('label')}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
