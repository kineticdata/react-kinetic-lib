import { List, Map, Record } from 'immutable';

export const FormState = Record({
  addFields: List(),
  alterFields: Map(),
  bindings: {},
  dataSources: null,
  error: null,
  fields: null,
  fieldsFn: null,
  formKey: null,
  formOptions: Map(),
  initialValuesFn: null,
  onError: null,
  onSave: null,
  onSubmit: null,
  submitting: false,
});

export const DATA_SOURCE_STATUS = {
  UNINITIALIZED: 'UNINITIALIZED',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
};

export const DataSource = Record({
  data: null,
  fn: null,
  params: null,
  paramsFn: null,
  prevParams: null,
  rawParams: null,
  status: DATA_SOURCE_STATUS.UNINITIALIZED,
  transform: null,
});

export const FIELD_DEFAULT_VALUES = Map({
  attributes: Map(),
  checkbox: false,
  'checkbox-multi': List(),
  'select-multi': List(),
  team: null,
  'team-multi': List(),
  'text-multi': List(),
  user: null,
  'user-multi': List(),
});

export const Field = Record({
  constraint: null,
  constraintMessage: 'Invalid',
  dirty: false,
  enabled: true,
  errors: List(),
  eventHandlers: Map(),
  focused: false,
  functions: Map(),
  helpText: '',
  id: '',
  initialValue: null,
  label: '',
  name: '',
  onChange: null,
  options: List(),
  pattern: null,
  patternMessage: 'Invalid format',
  placeholder: '',
  renderAttributes: Map(),
  required: false,
  requiredMessage: 'This field is required',
  search: Map(),
  serialize: null,
  touched: false,
  transient: false,
  type: '',
  valid: true,
  value: null,
  visible: true,
});
