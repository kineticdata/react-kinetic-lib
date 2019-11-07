import { fromJS, List, Map, OrderedMap } from 'immutable';
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
      .merge(Map(dataSources(formOptions)))
      .map(createDataSource),
    fieldsFn: fields,
    formKey,
    formOptions,
    onError: onError && onError(formOptions),
    onSave: onSave && onSave(formOptions),
    onSubmit: onSubmit && onSubmit(formOptions),
  });
