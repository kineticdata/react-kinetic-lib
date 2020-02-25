import React from 'react';
import { PropRow, PropsTable } from '../PropsTable';
import { TypePopover } from '../TypePopover';

export const FormLayoutProps = ({ bindings, formOptions }) => {
  return (
    <PropsTable>
      <PropRow
        description="Current bindings available to the form, data sources and values."
        name="bindings"
        type={<TypePopover name="Bindings" typeSpec={bindings} />}
      />
      <PropRow
        description="Resulting element from FormButtons component."
        name="buttons"
        type="React.Element"
      />
      <PropRow
        description="Tracks whether any field on the form is dirty."
        name="dirty"
        type="boolean"
      />
      <PropRow
        description="Resulting element from FormError component."
        name="error"
        type="React.Element"
      />
      <PropRow
        description="Ordered map of field names to elements from various Field components."
        name="fields"
        type="Immutable.OrderedMap<string, React.Element>"
      />
      <PropRow
        description="Options passed to the form component from the page context."
        name="formOptions"
        type={<TypePopover name="FormOptions" typeSpec={formOptions} />}
      />
      <PropRow
        description="A data structure that contains metadata about the fields on the form. Currently there is one entry per field and it tracks whether the field is currently visible."
        name="meta"
        type="Immutable.Map<string, Immutable.Map<string,any>>"
      />
    </PropsTable>
  );
};
