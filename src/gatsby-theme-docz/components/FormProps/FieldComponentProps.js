import React from 'react';
import { PropRow, PropsTable } from './PropsTable';

export const FieldComponentProps = ({ bindings, type }) => {
  return (
    <PropsTable>
      <PropRow
        description="lorem ipsum dolor sit amet"
        name="id"
        odd
        type="string"
      />
      <PropRow
        description="lorem ipsum dolor sit amet"
        name="label"
        type="string"
      />
      <PropRow
        description="lorem ipsum dolor sit amet"
        name="name"
        odd
        type="string"
      />
      <PropRow
        description="lorem ipsum dolor sit amet"
        name="onBlur"
        type="(e: Event) => void)"
      />
      <PropRow
        description="lorem ipsum dolor sit amet"
        name="onChange"
        odd
        type="(e: Event) => void)"
      />
      <PropRow
        description="lorem ipsum dolor sit amet"
        name="onFocus"
        type="(e: Event) => void)"
      />
      <PropRow
        description="lorem ipsum dolor sit amet"
        name="placeholder"
        odd
        type="string"
      />
    </PropsTable>
  );
};
