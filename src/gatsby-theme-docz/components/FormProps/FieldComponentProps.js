import React from 'react';
import { PropRow, PropsTable } from './PropsTable';

const meta = {
  AttributesField: {
    onChange: {
      description:
        'Function to call when updating the value of the field. It expects to receive the full value. There should not be any empty strings allowed in the value',
      type: '(value: Immutable.Map<string, Immutable.List<string>>) => void',
    },
    options: {
      description:
        'The map contains "allowsMultiple", "description", and "name".',
      type: 'Immutable.Map<string, string>',
    },
    value: {
      description:
        'Should never be null, a blank value should be represented by an empty map.',
      type: 'Immutable.Map<string, Immutable.List<string>>',
    },
  },
  CheckboxField: {
    onChange: {
      description:
        'Callback to be passed as onChange to the checkbox <input> element.',
      type: '(e: Event) => void',
    },
    value: {
      description: 'Should never be null.',
      type: 'boolean',
    },
  },
  CodeField: {
    onChange: {
      description: 'Function to call when updating the value of the field.',
      type: '(value: string) => void',
    },
    value: {
      description:
        'Should never be null, if the input is empty the value will be an empty string.',
      type: 'string',
    },
  },
  PasswordField: {
    onChange: {
      description:
        'Callback to be passed as onChange to the password <input> element.',
      type: '(e: Event) => void',
    },
    value: {
      description:
        'Should never be null, if the input is empty the value will be an empty string.',
      type: 'string',
    },
  },
  RadioField: {
    onChange: {
      description:
        'Callback to be passed as onChange to each of the radio <input> elements.',
      type: '(e: Event) => void',
    },
    options: {
      description:
        'The map contains "label" and "value". The label will be displayed and the value will be submitted',
      type: 'Immutable.Map<string, string>',
    },
    value: {
      description:
        'Should never be null, an unchecked value will be represented by an empty string',
      type: 'string',
    },
  },
  SelectField: {
    onChange: {
      description: 'Callback to be passed as onChange to the <select> element.',
      type: '(e: Event) => void',
    },
    options: {
      description:
        'The map contains "label" and "value". The label will be displayed and the value will be submitted',
      type: 'Immutable.Map<string, string>',
    },
    value: {
      description:
        'Should never be null, an unselected value will be represented by an empty string',
      type: 'boolean',
    },
  },
  SelectMultiField: {
    onChange: {
      description:
        'Function to call when updating the value of the field. It expects to receive the full value. There should not be any empty strings allowed in the value',
      type: '(value: Immutable.List<string>) => void',
    },
    options: {
      description:
        'The map contains "label" and "value". The label will be displayed and the value will be submitted',
      type: 'Immutable.Map<string, string>',
    },
    value: {
      description:
        'List of strings for each of the <select> elements. There should not be any empty strings allowed in the value',
      type: 'string',
    },
  },
  TeamField: {
    onChange: {
      description:
        'Function to call when updating the value of the field. It expects to receive the full value.',
      type: '(value: Immutable.Map<string, any>) => void',
    },
    value: {
      description:
        'The map contains properties from the team object retrieved from the application. Properties include but are not limited to: "name", "description", "slug".',
      type: 'Immutable.Map<string, any>',
    },
  },
  TeamMultiField: {
    onChange: {
      description:
        'Function to call when updating the value of the field. It expects to receive the full value.',
      type: '(value: Immutable.List<Immutable.Map<string, any>>) => void',
    },
    value: {
      description:
        'Each map contains properties from the team object retrieved from the application. Properties include but are not limited to: "name", "description", "slug".',
      type: 'Immutable.List<Immutable.Map<string, any>>',
    },
  },
  TextField: {
    onChange: {
      description:
        'Callback to be passed as onChange to the text <input> element.',
      type: '(e: Event) => void',
    },
    value: {
      description:
        'Should never be null, if the input is empty the value will be an empty string.',
      type: 'string',
    },
  },
  TextMultiField: {
    onChange: {
      description:
        'Function to call when updating the value of the field. It expects to receive the full value. There should not be any empty strings allowed in the value',
      type: '(value: Immutable.List<string>) => void',
    },
    value: {
      description:
        'List of strings for each of the text <input> elements. There should not be any empty strings allowed in the value',
      type: 'string',
    },
  },
  UserField: {
    onChange: {
      description:
        'Function to call when updating the value of the field. It expects to receive the full value.',
      type: '(value: Immutable.Map<string, any>) => void',
    },
    value: {
      description:
        'The map contains properties from the user object retrieved from the application. Properties include but are not limited to: "username", "email", "displayName", "spaceAdmin".',
      type: 'Immutable.Map<string, any>',
    },
  },
  UserMultiField: {
    onChange: {
      description:
        'Function to call when updating the value of the field. It expects to receive the full value.',
      type: '(value: Immutable.List<Immutable.Map<string, any>>) => void',
    },
    value: {
      description:
        'Each map contains properties from the user object retrieved from the application. Properties include but are not limited to: "username", "email", "displayName", "spaceAdmin".',
      type: 'Immutable.List<Immutable.Map<string, any>>',
    },
  },
};

export const FieldComponentProps = ({ type }) => (
  <PropsTable>
    <PropRow
      name="dirty"
      type="boolean"
      description="Whether the current value is different than the initial value. If a field was changed then changed back to the initial value dirty will be false."
    />
    <PropRow
      name="enabled"
      type="boolean"
      description="Whether the field should be editable or read-only."
    />
    <PropRow
      name="errors"
      type="Immutable.List<string>"
      description="List of field validation errors based on `required`, `pattern`, and `customConstraint`."
    />
    <PropRow
      name="focused"
      type="boolean"
      description="If the field is focused. If the field has multiple inputs should be true if any of them have focus."
    />
    <PropRow
      name="helpText"
      type="string"
      description="Instructions or information the end user may need to fill out the field."
    />
    <PropRow
      name="id"
      type="string"
      description="Programmatically generated id to put on the element for the sole purpose of correctly configuring <label> tags. Do not rely on these for any custom logic, they will change."
    />
    <PropRow
      name="label"
      type="string"
      description="User-facing label to be used in <label> tag"
    />
    {type === 'CodeField' && (
      <PropRow
        name="language"
        type="'js' | 'js-template' | 'erb' | 'ruby'"
        description="Prop to pass to <CodeInput> so it can highlight the syntax appropriately"
      />
    )}
    <PropRow
      name="name"
      type="string"
      description="Programmatic name of the field, usually this corresponds to the name of the property in the model being edited."
    />
    <PropRow
      name="onBlur"
      type="(e: Event) => void"
      description="Callback to be used as onBlur for interactive elements in the field implementation. If there are multiple interactive elements this should probably be added to all of them. How the form tracks `focused`."
    />
    <PropRow
      name="onChange"
      type={meta[type].onChange.type}
      description={meta[type].onChange.description}
    />
    <PropRow
      name="onFocus"
      type="(e: Event) => void"
      description="Callback to be used as onFocus for interactive elements in the field implementation. If there are multiple interactive elements this should probably be added to all of them. How the form tracks `focused` and `touched`."
    />
    {meta[type].options && (
      <PropRow
        name="options"
        type={`Immutable.List<${meta[type].options.type}>`}
        description={meta[type].options.description}
      />
    )}
    <PropRow
      name="placeholder"
      type="string"
      description="Text to be shown as placeholder in applicable fields"
    />
    <PropRow
      name="renderAttributes"
      type="Immutable.Map<string,any>"
      description="Custom attributes that can be leveraged by logic in Field component implementations. The form itself does not use this in any way, and it is only populated by customizations in `addFields` and `alterFields` options."
    />
    <PropRow
      name="required"
      type="boolean"
      description="Whether or not the field is required. This can change if the field is conditionally required."
    />
    <PropRow
      name="touched"
      type="boolean"
      description="The field has been touched if it has ever been focused, it does not have to be changed for it to be touched."
    />
    <PropRow
      name="value"
      type={meta[type].value.type}
      description={meta[type].value.description}
    />
    <PropRow
      name="visible"
      type="boolean"
      description="Whether the field is visible or hidden. This can change if the field is conditionally required."
    />
  </PropsTable>
);
