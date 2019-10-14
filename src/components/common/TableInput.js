import React, { Fragment } from 'react';
import { OrderedMap, Map } from 'immutable';

const TextInput = props => (
  <input
    type="text"
    id={props.id || props.name}
    name={props.name}
    value={props.value || ''}
    onBlur={props.onBlur}
    onChange={props.onChange}
    onFocus={props.onFocus}
  />
);

const CheckboxInput = props => (
  <input
    type="checkbox"
    id={props.id || props.name}
    name={props.name}
    checked={props.value || false}
    onBlur={props.onBlur}
    onChange={props.onChange}
    onFocus={props.onFocus}
  />
);

export const TableLayout = ({ rows, onAdd, rowConfig }) => (
  <Fragment>
    <table>
      <thead>
        <tr>
          {rowConfig
            .toIndexedSeq()
            .toList()
            .map(config => (
              <th key={config.get('name')}>{config.get('label')}</th>
            ))}
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    <button type="button" onClick={onAdd}>
      Add
    </button>
  </Fragment>
);

const RowLayout = ({ fields, onDelete }) => (
  <tr>
    {fields.map((field, name) => <td key={name}>{field}</td>).toList()}
    <td>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </td>
  </tr>
);

const typeToComponent = {
  text: 'TextInput',
  checkbox: 'CheckboxInput',
};

const defaultComponents = {
  TableLayout,
  RowLayout,
  TextInput,
  CheckboxInput,
};

const fieldFromConfig = (config, components = {}) => {
  return (
    components[typeToComponent[config.get('type')]] || components['TextInput']
  );
};

export const TableInput = props => {
  const { components = {}, rowConfig, rows, onChange, onBlur, onFocus } = props;
  const appliedComponents = {
    ...defaultComponents,
    ...components,
  };

  const { RowLayout, TableLayout } = appliedComponents;
  const handleAddRow = e => {
    e.preventDefault();

    const newRow = rowConfig.reduce(
      (row, config) =>
        row.set(
          config.get('name'),
          config.get('type') === 'checkbox' ? false : '',
        ),
      Map(),
    );

    onChange(rows.push(newRow));
  };

  const fieldRows = props.rows.map((row, index) => {
    const handleDeleteRow = e => {
      e.preventDefault();

      onChange(rows.delete(index));
    };

    const fields = rowConfig.reduce((fields, config) => {
      const Field = fieldFromConfig(config, appliedComponents);
      const value = row.get(config.get('name'));
      const handleChangeField = e =>
        onChange(rows.setIn([index, config.get('name')], e.target.value));

      return fields.set(
        config.get('name'),
        <Field
          value={value}
          onChange={handleChangeField}
          label={config.get('label')}
          onBlur={onBlur}
          onFocus={onFocus}
        />,
      );
    }, OrderedMap());
    return (
      <RowLayout
        key={index}
        fields={fields}
        rowConfig={rowConfig}
        onDelete={handleDeleteRow}
      />
    );
  });

  return (
    <TableLayout rows={fieldRows} onAdd={handleAddRow} rowConfig={rowConfig} />
  );
};
