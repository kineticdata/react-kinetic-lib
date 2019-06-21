import React from 'react';
import { get } from 'immutable';

const onInputChange = setCustom => event => {
  setCustom(['input'], event.target.value);
};

const add = (name, values, onChange, value, setCustom) => () => {
  onChange({
    target: {
      name,
      type: 'text-multi',
      value: values.push(value),
    },
  });
  setCustom(['input'], '');
};

const remove = (name, values, onChange) => index => () => {
  onChange({
    target: {
      name,
      type: 'text-multi',
      value: values.filter((v, i) => i !== index),
    },
  });
};

export const TextMultiField = props => (
  <div className="field">
    {props.label}
    {props.value.map((v, i) => (
      <span key={i}>
        {v}
        <button
          type="button"
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onClick={props.remove(i)}
        >
          x
        </button>
      </span>
    ))}
    <input
      type="text"
      value={props.inputValue}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onChange={props.inputChange}
    />
    <button
      type="button"
      disabled={!props.inputValue}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onClick={props.add}
    >
      +
    </button>
  </div>
);

export const generateTextMultiFieldProps = props => ({
  ...props,
  inputValue: props.custom.get('input', ''),
  inputChange: onInputChange(props.setCustom),
  remove: remove(props.name, props.value, props.onChange),
  add: add(
    props.name,
    props.value,
    props.onChange,
    get(props.custom, 'input', ''),
    props.setCustom,
  ),
});
