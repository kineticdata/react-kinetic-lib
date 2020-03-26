import React from 'react';

export const SelectField = props =>
  props.visible && (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field is-narrow">
          <div className="control">
            <div className="select is-fullwidth">
              <select
                id={props.id}
                name={props.name}
                value={props.value}
                onBlur={props.onBlur}
                onChange={props.onChange}
                onFocus={props.onFocus}
              >
                <option value="">
                  {(!props.value &&
                    !props.touched &&
                    !props.focused &&
                    props.placeholder) ||
                    ''}
                </option>
                {props.options.map((option, i) => (
                  <option value={option.get('value')} key={i}>
                    {option.get('label')
                      ? option.get('label')
                      : option.get('value')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
