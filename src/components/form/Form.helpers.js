import { fromJS, List, Map, OrderedMap } from 'immutable';
import { isFunction } from 'lodash-es';
import {
  DataSource,
  Field,
  FIELD_DEFAULT_VALUES,
  FormState,
} from './Form.models';
import { onBlur, onChange as onChangeHandler, onFocus } from './Form';

const sameName = field1 => field2 => field1.name === field2.name;

export const resolveFieldConfig = (
  formOptions,
  bindings,
  fieldsFn,
  addFieldsParam = [],
  alterFieldsParam = {},
) => {
  const fields = fieldsFn(formOptions)(bindings);
  const addFields =
    typeof addFieldsParam === 'function'
      ? addFieldsParam(formOptions)(bindings)
      : addFieldsParam;
  const alterFields =
    typeof alterFieldsParam === 'function'
      ? alterFieldsParam(formOptions)(bindings)
      : alterFieldsParam;
  if (fields && addFields && alterFields) {
    return OrderedMap(
      [
        ...fields,
        ...addFields
          .filter(field => !fields.find(sameName(field)))
          .map(field => ({ ...field, transient: true })),
      ]
        .filter(field => !!field)
        .map(({ name, type, ...fieldConfig }) => ({
          ...fieldConfig,
          ...(alterFields[name] || {}),
          name,
          type,
        }))
        .map(field => [field.name, field]),
    );
  }
};

export const createField = formKey => ({
  constraint,
  constraintMessage,
  enabled,
  helpText,
  initialValue,
  label,
  language,
  name,
  onChange,
  options,
  pattern,
  patternMessage,
  placeholder,
  renderAttributes,
  required,
  requiredMessage,
  search,
  serialize,
  transient,
  type,
  visible,
}) => {
  const defaultedValue =
    initialValue === undefined
      ? FIELD_DEFAULT_VALUES.get(type, '')
      : fromJS(initialValue);
  return Field({
    // Derived options
    id: btoa(`${formKey} ${name}`).replace(/=+$/, ''),
    initialValue: defaultedValue,
    renderAttributes: fromJS(renderAttributes),
    value: defaultedValue,
    // Options supporting conditional expressions,
    enabled: typeof enabled === 'function' ? false : enabled,
    label: typeof label === 'function' ? '' : label,
    options: typeof options === 'function' ? List() : fromJS(options),
    placeholder: typeof placeholder === 'function' ? '' : placeholder,
    required: typeof required === 'function' ? false : required,
    search: typeof search === 'function' ? Map() : fromJS(search),
    transient: typeof transient === 'function' ? false : transient,
    visible: typeof visible === 'function' ? false : visible,
    functions: Map({
      enabled: typeof enabled === 'function' ? enabled : null,
      label: typeof label === 'function' ? label : null,
      options: typeof options === 'function' ? options : null,
      placeholder: typeof placeholder === 'function' ? placeholder : null,
      required: typeof required === 'function' ? required : null,
      search: typeof search === 'function' ? search : null,
      transient: typeof transient === 'function' ? transient : null,
      visible: typeof visible === 'function' ? visible : null,
    }),
    // Event handlers
    eventHandlers: Map({
      onBlur: onBlur({ formKey, name }),
      onChange: onChangeHandler({ formKey, type, name }),
      onFocus: onFocus({ formKey, name }),
    }),
    // Pass-through options
    constraint,
    constraintMessage,
    helpText,
    language,
    name,
    onChange,
    pattern,
    patternMessage,
    requiredMessage,
    serialize,
    type,
  });
};

export const createDataSource = ({ fn, params, transform }) => {
  const paramProp = typeof params === 'function' ? 'paramsFn' : 'rawParams';
  return DataSource({
    fn,
    [paramProp]: params,
    transform,
  });
};

export const createFormState = ({
  addDataSources,
  addFields,
  alterFields,
  dataSources,
  fields,
  formKey,
  formOptions,
  onError,
  onSave,
  onSubmit,
}) =>
  FormState({
    addFields,
    alterFields,
    dataSources: Map(addDataSources)
      .merge(Map(dataSources))
      .map(createDataSource),
    fieldsFn: fields,
    formKey,
    formOptions,
    onError: onError && onError(formOptions),
    onSave: onSave && onSave(formOptions),
    onSubmit: onSubmit && onSubmit(formOptions),
  });

export const buildPropertyFields = ({
  isNew,
  properties,
  getName,
  getRequired,
  getSensitive,
  getValue,
}) => ({
  propertiesFields: properties
    .flatMap(property => {
      const name = getName(property);
      const required = isFunction(getRequired) && getRequired(property);
      const sensitive = isFunction(getSensitive) && getSensitive(property);
      const value = getValue(property);
      return !sensitive || isNew
        ? [
            {
              name: `property_${name}`,
              label: name,
              type: sensitive ? 'password' : 'text',
              required: required,
              transient: true,
              initialValue: value,
            },
          ]
        : [
            {
              name: `property_${name}`,
              label: name,
              type: 'password',
              required: required
                ? ({ values }) => values.get(`changeProperty_${name}`)
                : false,
              transient: true,
              initialValue: '',
              visible: ({ values }) => values.get(`changeProperty_${name}`),
            },
            {
              name: `changeProperty_${name}`,
              label: `Change ${name}`,
              type: 'checkbox',
              transient: true,
              initialValue: false,
              onChange: ({ values }, { setValue }) => {
                if (values.get(`property_${name}`) !== '') {
                  setValue(`property_${name}`, '');
                }
              },
            },
          ];
    })
    .toArray(),
  propertiesSerialize: ({ values }) =>
    properties
      .filter(
        prop =>
          isNew ||
          !isFunction(getSensitive) ||
          !getSensitive(prop) ||
          values.get(`changeProperty_${getName(prop)}`),
      )
      .map(getName)
      .reduce(
        (reduction, propName) =>
          reduction.set(propName, values.get(`property_${propName}`)),
        Map(),
      )
      .toObject(),
});

export const getComponentName = field =>
  field.type
    ? field.type
        .split('-')
        .map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
        .join('') + 'Field'
    : null;

export const getFieldComponentProps = field => ({
  dirty: field.dirty,
  enabled: field.enabled,
  errors: field.errors,
  focused: field.focused,
  helpText: field.helpText,
  id: field.id,
  label: field.label,
  language: field.type === 'code' ? field.language : undefined,
  name: field.name,
  onBlur: field.eventHandlers.get('onBlur'),
  onChange: field.eventHandlers.get('onChange'),
  onFocus: field.eventHandlers.get('onFocus'),
  options: [
    'attributes',
    'code',
    'form',
    'form-multi',
    'radio',
    'select',
    'select-multi',
    'subform',
    'table',
    'text',
    'text-multi',
  ].includes(field.type)
    ? field.options
    : undefined,
  placeholder: field.placeholder,
  renderAttributes: field.renderAttributes,
  required: field.required,
  search: ['form', 'form-multi'].includes(field.type)
    ? field.search
    : undefined,
  touched: field.touched,
  value: field.value,
  visible: field.visible,
});
