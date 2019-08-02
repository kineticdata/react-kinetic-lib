import React from 'react';
import { CodeInput } from '../../common/code_input/CodeInput';

export const CodeTemplateField = props =>
  props.visible && (
    <div className="field">
      <label htmlFor={props.id || props.name}>{props.label}</label>
      <CodeInput
        template
        id={props.id || props.name}
        bindings={props.options}
        value={props.value}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onFocus={props.onFocus}
      />
    </div>
  );
