import React, { Component, Fragment } from 'react';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import t from 'prop-types';
import {
  fromJS,
  getIn,
  is,
  isImmutable,
  isIndexed,
  List,
  Map,
  OrderedMap,
  OrderedSet,
  Seq,
  Set,
} from 'immutable';
import { action, connect, dispatch, regHandlers, regSaga } from '../../store';
import { ComponentConfigContext } from '../common/ComponentConfigContext';
import { generateKey } from '../../helpers';

import { Field } from './Field';

export const getTimestamp = () => Math.floor(new Date().getTime() / 1000);
const identity = it => it;

const sameName = left => right => left.name === right.name;

export const isEmpty = value =>
  value === null ||
  value === undefined ||
  value === '' ||
  (isImmutable(value) && value.isEmpty());

const convertDataSource = ([fn, args = [], options = {}]) =>
  fromJS({
    fn,
    argsFn: typeof args === 'function' ? args : () => args,
    options,
  });

export const initializeDataSources = dataSources =>
  resolveAncestorDependencies(Map(dataSources).map(convertDataSource));

const resolveAncestorDependencies = (
  dataSources,
  ancestorsMap = Map({ values: Set() }),
) => {
  const nextAncestorsMap = dataSources
    .map(dataSource => dataSource.getIn(['options', 'dependencies'], List()))
    .filter(deps => deps.every(dep => ancestorsMap.has(dep)))
    .reduce(
      (reduction, deps, name) =>
        reduction.set(
          name,
          deps.toSet().concat(deps.flatMap(dep => ancestorsMap.get(dep))),
        ),
      ancestorsMap,
    );

  if (dataSources.keySeq().every(name => ancestorsMap.has(name))) {
    return dataSources.map((dataSource, name) =>
      dataSource.setIn(
        ['options', 'ancestorDependencies'],
        ancestorsMap
          .get(name)
          .toList()
          .sort(),
      ),
    );
  } else {
    if (!nextAncestorsMap.equals(ancestorsMap)) {
      return resolveAncestorDependencies(dataSources, nextAncestorsMap);
    } else {
      throw new Error(
        'Could not resolve dependency graph due to missing or cyclic dependencies',
      );
    }
  }
};

const reinitializeFields = fields =>
  fields.map(field =>
    field.merge({
      initialValue: field.get('value'),
      dirty: false,
      touched: false,
    }),
  );

const resetValues = fields =>
  fields.map(field =>
    field.merge({
      value: field.get('initialValue'),
      dirty: false,
      touched: false,
    }),
  );

const defaultFieldProps = fromJS({
  enabled: true,
  options: [],
  required: false,
  placeholder: '',
  visible: true,
  dirty: false,
  focused: false,
  touched: false,
  errors: [],
  renderAttributes: {},
});

const dynamicFieldProps = List([
  'enabled',
  'initialValue',
  'options',
  'required',
  'placeholder',
  'visible',
  'label',
  'transient',
]);

const selectDataSourcesData = formKey => state =>
  state
    .getIn(['forms', formKey, 'dataSources'], Map())
    .map(dataSource => dataSource.get('data'))
    .toObject();

const selectValues = formKey => state =>
  state
    .getIn(['forms', formKey, 'fields'], Map())
    .map(field => field.get('value'));

const selectBindings = formKey => state => ({
  ...selectDataSourcesData(formKey)(state),
  values: selectValues(formKey)(state),
});

// If the value is already an immutable list but it contains native objects
// fromJS will not convert those objects to Maps so we need this helper to
// perform that conversion.
const convertPropValue = value =>
  isIndexed(value) ? value.map(entry => fromJS(entry)) : fromJS(value);

const evaluateFieldProps = (props, bindings) => field =>
  props.reduce(
    (updatedField, prop) =>
      updatedField.hasIn(['functions', prop])
        ? updatedField.set(
            prop,
            convertPropValue(updatedField.getIn(['functions', prop])(bindings)),
          )
        : updatedField,
    field,
  );

const defaultMap = Map({
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

const defaultInitialValue = field =>
  field.get('initialValue') === null || field.get('initialValue') === undefined
    ? field.set('initialValue', defaultMap.get(field.get('type'), ''))
    : field;

const convertField = field =>
  dynamicFieldProps.reduce(
    (acc, prop) =>
      typeof field[prop] === 'function'
        ? acc.setIn(['functions', prop], field[prop]).set(prop, null)
        : field[prop] !== undefined
        ? acc.set(prop, convertPropValue(field[prop]))
        : acc,
    Map(defaultFieldProps).mergeDeep(field),
  );

export const checkRequired = field =>
  field.get('required') && isEmpty(field.get('value'))
    ? List([field.get('requiredMessage', 'This field is required')])
    : List();

export const checkPattern = field =>
  field.get('pattern') &&
  field.get('type') !== 'text' &&
  field.get('value') !== '' &&
  !field.get('value').match(field.get('pattern'))
    ? List([field.get('patternMessage', 'Invalid format')])
    : List();

export const checkConstraint = values => field =>
  field.get('constraint') && !field.get('constraint')({ values })
    ? List([field.get('constraintMessage', 'Invalid')])
    : List();

export const validateFields = fields =>
  fields.map(field =>
    field.set(
      'errors',
      List([
        checkRequired,
        checkPattern,
        checkConstraint(fields.map(f => f.get('value'))),
      ]).flatMap(fn => fn(field)),
    ),
  );

regHandlers({
  MOUNT_FORM: (state, { payload: { formKey } }) => {
    return state.setIn(['forms', formKey, 'mounted'], true);
  },
  UNMOUNT_FORM: (state, { payload: { formKey } }) => {
    return state.deleteIn(['forms', formKey]);
  },
  CONFIGURE_FORM: (
    state,
    {
      payload: {
        formKey,
        config: {
          addFields = [],
          alterFields = {},
          dataSources,
          fields,
          onSubmit,
          onSave,
          onError,
        },
      },
    },
  ) =>
    !state.getIn(['forms', formKey, 'mounted'])
      ? state
      : state.hasIn(['forms', formKey, 'configured'])
      ? state.setIn(['forms', formKey, 'initialize'], false)
      : state.mergeIn(
          ['forms', formKey],
          Map({
            dataSources: initializeDataSources(dataSources),
            fields: OrderedMap(
              List([
                ...fields,
                ...addFields
                  .filter(field => !fields.find(sameName(field)))
                  .map(field => ({ ...field, transient: true })),
              ])
                .filter(field => !!field)
                .map(field => [field.name, field]),
            )
              .mergeDeep(
                Map(alterFields).map(
                  ({ name, type, ...allowedAlterations }) => allowedAlterations,
                ),
              )
              .map(convertField),
            state: Map(),
            onSubmit,
            onSave,
            onError,
            loaded: false,
            submitting: false,
            error: null,
            configured: true,
            initialize: true,
          }),
        ),
  EVAL_INITIAL_VALUES: (state, { payload: { formKey } }) => {
    const bindings = selectDataSourcesData(formKey)(state);
    return state
      .updateIn(['forms', formKey, 'fields'], fields =>
        fields
          .map(evaluateFieldProps(['initialValue'], bindings))
          .map(defaultInitialValue)
          .map(field => field.set('value', field.get('initialValue'))),
      )
      .setIn(['forms', formKey, 'valuesInitialized'], true);
  },
  EVAL_FIELDS: (state, { payload: { formKey } }) => {
    const bindings = selectBindings(formKey)(state);
    return state
      .updateIn(['forms', formKey, 'fields'], fields =>
        fields.map(
          evaluateFieldProps(
            [
              'enabled',
              'options',
              'required',
              'visible',
              'label',
              'placeholder',
              'transient',
            ],
            bindings,
          ),
        ),
      )
      .updateIn(['forms', formKey, 'fields'], validateFields)
      .setIn(['forms', formKey, 'loaded'], true);
  },
  SET_VALUE: (state, { payload: { formKey, name, value } }) =>
    state.updateIn(['forms', formKey, 'fields', name], field =>
      field.merge({
        value,
        touched: true,
        dirty: !is(value, field.get('initialValue')),
      }),
    ),
  FOCUS_FIELD: (state, { payload: { formKey, field } }) =>
    state.setIn(['forms', formKey, 'fields', field, 'focused'], true),
  BLUR_FIELD: (state, { payload: { formKey, field } }) =>
    state
      .setIn(['forms', formKey, 'fields', field, 'focused'], false)
      .setIn(['forms', formKey, 'fields', field, 'touched'], true),
  TEARDOWN_FORM: (state, action) =>
    state.deleteIn(['forms', action.payload.formKey]),
  CALL_DATA_SOURCE: (state, { payload: { formKey, name, args } }) =>
    state
      .mergeIn(['forms', formKey, 'dataSources', name], {
        args,
        resolved: false,
      })
      .deleteIn(['forms', formKey, 'dataSources', name, 'data']),
  IGNORE_DATA_SOURCE: (state, { payload: { formKey, name } }) =>
    state
      .mergeIn(['forms', formKey, 'dataSources', name], {
        args: null,
        resolved: true,
      })
      .deleteIn(['forms', formKey, 'dataSources', name, 'data']),
  RESOLVE_DATA_SOURCE: (
    state,
    { payload: { formKey, shared, name, data: nativeData, timestamp, args } },
  ) => {
    const data = fromJS(nativeData);
    const updateShared = shared
      ? state.setIn(['dataSources', name], Map({ data, timestamp, args }))
      : state;
    return updateShared.mergeIn(['forms', formKey, 'dataSources', name], {
      data,
      args,
      resolved: true,
    });
  },
  RESET: (state, { payload: { formKey } }) =>
    state.hasIn(['forms', formKey])
      ? state.updateIn(['forms', formKey, 'fields'], resetValues)
      : state,
  SUBMIT: (state, { payload: { formKey } }) =>
    state.setIn(['forms', formKey, 'submitting'], true),
  SUBMIT_SUCCESS: (state, { payload: { formKey } }) =>
    state
      .setIn(['forms', formKey, 'submitting'], false)
      .setIn(['forms', formKey, 'error'], null)
      .updateIn(['forms', formKey, 'fields'], reinitializeFields),
  SUBMIT_ERROR: (state, { payload: { formKey, error } }) =>
    state
      .setIn(['forms', formKey, 'submitting'], false)
      .setIn(['forms', formKey, 'error'], error),
  CLEAR_ERROR: (state, { payload: { formKey } }) =>
    state.setIn(['forms', formKey, 'error'], null),
  SUBMIT_FIELD_ERRORS: (state, { payload: { formKey, fieldNames } }) =>
    state
      .setIn(['forms', formKey, 'submitting'], false)
      .setIn(['forms', formKey, 'error'], 'There are invalid fields')
      .updateIn(['forms', formKey, 'fields'], fields =>
        fields.map(field =>
          fieldNames.includes(field.get('name'))
            ? field.set('touched', true)
            : field,
        ),
      ),
});

regSaga(
  takeEvery('CONFIGURE_FORM', function*({ payload }) {
    const { formKey } = payload;
    const [initialize, dataSources] = yield select(state => [
      state.getIn(['forms', formKey, 'initialize']),
      state.getIn(['forms', formKey, 'dataSources']),
    ]);
    if (initialize) {
      // To kick things off we want to evaluate data sources with no dependencies.
      // The values for these initial evaluates will also not be available.
      const values = {};
      const initialDataSources = dataSources.filter(ds =>
        ds.getIn(['options', 'dependencies'], List()).isEmpty(),
      );
      if (!initialDataSources.isEmpty()) {
        yield all(
          initialDataSources
            .keySeq()
            .map(name =>
              put({
                type: 'CHECK_DATA_SOURCE',
                payload: { formKey, name, values },
              }),
            )
            .toArray(),
        );
      } else {
        yield put(action('EVAL_INITIAL_VALUES', { formKey }));
      }
    }
  }),
);

regSaga(
  takeEvery('CHECK_DATA_SOURCE', function*({ payload }) {
    const { formKey, name } = payload;
    const { args: prevArgs, argsFn, options } = yield select(state =>
      state.getIn(['forms', formKey, 'dataSources', name]).toObject(),
    );
    const dataSources = yield select(state =>
      state.getIn(['forms', formKey, 'dataSources']),
    );
    const values = yield select(state =>
      state.getIn(['forms', formKey, 'valuesInitialized'])
        ? state
            .getIn(['forms', formKey, 'fields'])
            .map(field => field.get('value'))
        : null,
    );
    const dependencies = dataSources
      .filter((ds, name) => options.get('dependencies', List()).contains(name))
      .map(ds => ds.get('data'))
      .toObject();

    const bindings = { ...dependencies, values };
    const runIfResult = !options.get('runIf') || options.get('runIf')(bindings);
    if (runIfResult) {
      const args = fromJS(argsFn(bindings));

      if (!args.equals(prevArgs)) {
        const data = yield select(state =>
          state.getIn(['dataSources', name, 'data']),
        );

        if (options.get('shared') && data) {
          yield put(
            action('RESOLVE_DATA_SOURCE', { formKey, name, data, args }),
          );
        } else {
          yield put(action('CALL_DATA_SOURCE', { formKey, name, args }));
        }
      }
    } else {
      yield put(action('IGNORE_DATA_SOURCE', { formKey, name }));
    }
  }),
);

regSaga(
  takeEvery('CALL_DATA_SOURCE', function*({ payload }) {
    const { formKey, name, args } = payload;
    const { fn, options } = yield select(state =>
      state.getIn(['forms', formKey, 'dataSources', name]).toObject(),
    );
    const shared = options.get('shared');
    const transform = options.get('transform', identity);
    const data = transform(yield call(fn, ...args.toJS()));
    const timestamp = yield call(getTimestamp);
    yield put({
      type: 'RESOLVE_DATA_SOURCE',
      payload: { formKey, name, shared, data, timestamp },
    });
  }),
);

const isResolved = dataSource => dataSource.get('resolved');
const dependsOn = (name, includeAncestors) => dataSource =>
  dataSource
    .getIn(
      ['options', includeAncestors ? 'ancestorDependencies' : 'dependencies'],
      List(),
    )
    .includes(name);

function* dataSourceSaga({ payload }) {
  const { formKey, name } = payload;
  const [dataSources, valuesInitialized] = yield select(state => [
    state.getIn(['forms', formKey, 'dataSources']),
    state.getIn(['forms', formKey, 'valuesInitialized']),
  ]);
  yield all(
    dataSources
      .filter(dependsOn(name))
      .keySeq()
      .map(name => put(action('CHECK_DATA_SOURCE', { formKey, name })))
      .toArray(),
  );
  if (
    dataSources.filterNot(dependsOn('values', true)).every(isResolved) &&
    !valuesInitialized
  ) {
    yield put(action('EVAL_INITIAL_VALUES', { formKey }));
  }
  if (dataSources.every(isResolved) && valuesInitialized) {
    yield put(action('EVAL_FIELDS', { formKey }));
  }
}

regSaga(takeEvery('RESOLVE_DATA_SOURCE', dataSourceSaga));
regSaga(takeEvery('IGNORE_DATA_SOURCE', dataSourceSaga));

regSaga(
  takeEvery('EVAL_INITIAL_VALUES', function*({ payload: { formKey } }) {
    const dataSources = yield select(state =>
      state.getIn(['forms', formKey, 'dataSources']),
    );
    const actions = dataSources
      .filter(dependsOn('values'))
      .keySeq()
      .map(name => put(action('CHECK_DATA_SOURCE', { formKey, name })));

    if (actions.isEmpty()) {
      yield put(action('EVAL_FIELDS', { formKey }));
    } else {
      yield all(actions.toArray());
    }
  }),
);

regSaga(
  takeEvery('SET_VALUE', function*({
    payload: { formKey, name, triggerChange },
  }) {
    if (triggerChange) {
      const onChange = yield select(state =>
        state.getIn(['forms', formKey, 'fields', name, 'onChange']),
      );
      if (onChange) {
        yield call(
          onChange,
          yield select(selectBindings(formKey)),
          bindActions(formKey),
        );
      }
    }
    const dataSources = yield select(state =>
      state.getIn(['forms', formKey, 'dataSources']),
    );
    yield put(action('EVAL_FIELDS', { formKey }));
    yield all(
      dataSources
        .filter(dependsOn('values'))
        .keySeq()
        .map(name => put(action('CHECK_DATA_SOURCE', { formKey, name })))
        .toArray(),
    );
  }),
);

regSaga(
  takeEvery('RESET', function*({ payload: { formKey } }) {
    const dataSources = yield select(state =>
      state.getIn(['forms', formKey, 'dataSources']),
    );
    if (dataSources) {
      yield put(action('EVAL_FIELDS', { formKey }));
      yield all(
        dataSources
          .filter(dependsOn('values'))
          .keySeq()
          .map(name => put(action('CHECK_DATA_SOURCE', { formKey, name })))
          .toArray(),
      );
    }
  }),
);

regSaga(
  takeEvery('REJECT_DATA_SOURCE', function*({ payload }) {
    yield call(console.error, 'REJECT_DATA_SOURCE', payload);
  }),
);

regSaga(
  takeEvery('SUBMIT', function*({ payload: { formKey, fieldSet } }) {
    const bindings = yield select(selectBindings(formKey));
    const [onSubmit, onSave, onError, values, errors] = yield select(state => [
      state.getIn(['forms', formKey, 'onSubmit']),
      state.getIn(['forms', formKey, 'onSave']),
      state.getIn(['forms', formKey, 'onError']),
      state
        .getIn(['forms', formKey, 'fields'])
        .filter(
          field =>
            !field.get('transient') && fieldSet.contains(field.get('name')),
        )
        .map(field =>
          field.has('serialize')
            ? field.get('serialize')(bindings)
            : field.get('value'),
        ),
      state
        .getIn(['forms', formKey, 'fields'])
        .map(field => field.get('errors'))
        .filter(errors => !errors.isEmpty()),
    ]);

    if (errors.isEmpty()) {
      try {
        const result = yield call(onSubmit, values, bindings);
        dispatch('SUBMIT_SUCCESS', { formKey });
        if (onSave) yield call(onSave, result);
      } catch (error) {
        dispatch('SUBMIT_ERROR', { formKey, error });
        if (onError) yield call(onError, error);
      }
    } else {
      dispatch('SUBMIT_FIELD_ERRORS', {
        formKey,
        fieldNames: errors.keySeq(),
      });
    }
  }),
);

const actions = {
  setValue: formKey => (name, value, triggerChange = true) =>
    dispatch('SET_VALUE', { formKey, name, value, triggerChange }),
};

const bindActions = formKey =>
  Object.entries(actions).reduce(
    (acc, [name, fn]) => ({ ...acc, [name]: fn(formKey) }),
    {},
  );

export const onFocus = ({ formKey, field }) => () => {
  dispatch('FOCUS_FIELD', { formKey, field });
};

export const onBlur = ({ formKey, field }) => () => {
  dispatch('BLUR_FIELD', { formKey, field });
};

export const onChange = ({ formKey, type, name }) => event => {
  let value;
  if (type === 'checkbox' && event && event.target) {
    value = event.target.checked;
  } else if (
    type === 'select-multi' &&
    event &&
    event.target &&
    event.target.options
  ) {
    value = List(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
  } else if (event && event.target) {
    value = event.target.value;
  } else {
    value = event;
  }
  actions.setValue(formKey)(name, value);
};

export const onSubmit = (formKey, fieldSet) => event => {
  event && event.preventDefault && event.preventDefault();
  dispatch('SUBMIT', { formKey, fieldSet });
};

const onReset = formKey => () => {
  resetForm(formKey);
};

export const clearError = formKey => event => {
  dispatch('CLEAR_ERROR', { formKey });
};

export const mountForm = formKey => dispatch('MOUNT_FORM', { formKey });
export const unmountForm = formKey => dispatch('UNMOUNT_FORM', { formKey });
export const resetForm = formKey => dispatch('RESET', { formKey });

export const configureForm = (formKey, config) =>
  dispatch('CONFIGURE_FORM', { formKey, config });

export const mapStateToProps = (state, props) =>
  state
    .getIn(['forms', props.formKey], Map())
    .set('bindings', selectBindings(props.formKey)(state))
    .toObject();

const extractFieldComponents = ({ fields, addFields, alterFields }) =>
  Seq(addFields)
    .concat(fields)
    .reduce(
      (result, current) =>
        result.set(
          current.name,
          getIn(alterFields, [current.name, 'component'], current.component),
        ),
      Map(),
    )
    .filter(component => !!component)
    .toObject();

// Wraps the FormImpl to handle the formKey behavior. If this is passed a
// formKey prop this wrapper is essentially a noop, but if it is not passed a
// formKey then it generates one and stores it as component state and passes
// that to FormImpl. That was FormImpl can always assume there is a formKey and
// it can

/**
 * @component
 */
export class Form extends Component {
  constructor(props) {
    super(props);
    const { components, fieldSet, formKey, ...config } = props;
    this.config = config;
    this.auto = !formKey;
    this.formKey = formKey || generateKey();
  }

  componentDidMount() {
    if (this.auto) {
      mountForm(this.formKey);
    }
  }

  componentWillUnmount() {
    if (this.auto) {
      unmountForm(this.formKey);
    }
  }

  render() {
    return (
      <FormImpl
        fieldSet={this.props.fieldSet}
        formKey={this.formKey}
        components={this.props.components}
        fieldComponents={extractFieldComponents(this.config)}
        config={this.config}
      >
        {this.props.children}
      </FormImpl>
    );
  }
}

const DefaultFormWrapper = props => props.form;

const DefaultFormLayout = props => (
  <Fragment>
    {props.fields.toList()}
    {props.error}
    {props.buttons}
  </Fragment>
);

const DefaultFormError = props => (
  <div>
    {props.error}
    <button type="button" onClick={props.clear}>
      &times;
    </button>
  </div>
);

const DefaultFormButtons = props => (
  <div>
    <button
      type="submit"
      onClick={props.submit}
      disabled={!props.dirty || props.submitting}
    >
      Submit
    </button>
  </div>
);

class FormImplComponent extends Component {
  checkConfigure() {
    if (this.props.mounted && !this.props.configured) {
      configureForm(this.props.formKey, this.props.config);
    }
  }

  componentDidMount() {
    this.checkConfigure();
  }
  componentDidUpdate() {
    this.checkConfigure();
  }

  render() {
    return (
      <ComponentConfigContext.Consumer>
        {config => {
          const {
            components = {},
            fieldComponents = {},
            children: FormWrapper = DefaultFormWrapper,
          } = this.props;
          const {
            FormButtons = config.get('FormButtons', DefaultFormButtons),
            FormError = config.get('FormError', DefaultFormError),
            FormLayout = config.get('FormLayout', DefaultFormLayout),
          } = components;
          if (this.props.loaded) {
            const fullFieldSet = OrderedSet(this.props.fields.keySeq());
            const computedFieldSet = OrderedSet(
              !this.props.fieldSet
                ? fullFieldSet
                : typeof this.props.fieldSet === 'function'
                ? this.props.fieldSet(fullFieldSet)
                : this.props.fieldSet,
            );
            return (
              <FormWrapper
                initialized
                form={
                  <form
                    onSubmit={onSubmit(this.props.formKey, computedFieldSet)}
                  >
                    <FormLayout
                      fields={computedFieldSet
                        .reduce(
                          (map, fieldName) =>
                            map.set(
                              fieldName,
                              this.props.fields.get(fieldName),
                            ),
                          OrderedMap(),
                        )
                        .map(field => (
                          <Field
                            key={field.get('name')}
                            name={field.get('name')}
                            id={`${this.props.formKey}-${field.get('name')}`}
                            label={field.get('label')}
                            options={field.get('options')}
                            type={field.get('type')}
                            value={field.get('value')}
                            onFocus={onFocus({
                              formKey: this.props.formKey,
                              field: field.get('name'),
                            })}
                            onBlur={onBlur({
                              formKey: this.props.formKey,
                              field: field.get('name'),
                            })}
                            onChange={onChange({
                              formKey: this.props.formKey,
                              name: field.get('name'),
                              type: field.get('type'),
                            })}
                            visible={field.get('visible')}
                            required={field.get('required')}
                            placeholder={field.get('placeholder')}
                            helpText={field.get('helpText')}
                            enabled={field.get('enabled')}
                            dirty={field.get('dirty')}
                            valid={field.get('valid')}
                            focused={field.get('focused')}
                            touched={field.get('touched')}
                            errors={field.get('errors')}
                            components={{
                              context: config,
                              form: components,
                              field: fieldComponents[field.get('name')],
                            }}
                            renderAttributes={field.get('renderAttributes')}
                          />
                        ))}
                      error={
                        this.props.error && (
                          <FormError
                            error={this.props.error}
                            clear={clearError(this.props.formKey)}
                          />
                        )
                      }
                      buttons={
                        <FormButtons
                          reset={onReset(this.props.formKey)}
                          submit={onSubmit(
                            this.props.formKey,
                            computedFieldSet,
                          )}
                          submitting={this.props.submitting}
                          dirty={this.props.fields.some(field =>
                            field.get('dirty'),
                          )}
                        />
                      }
                      meta={this.props.fields.map(field =>
                        field.filter((value, key) => ['visible'].includes(key)),
                      )}
                    />
                  </form>
                }
                bindings={this.props.bindings}
              />
            );
          } else {
            return (
              <FormWrapper initialized={false} form={null} bindings={{}} />
            );
          }
        }}
      </ComponentConfigContext.Consumer>
    );
  }
}

const FormImpl = connect(mapStateToProps)(FormImplComponent);

Form.propTypes = {
  /** An object describing how a form fetches data. */
  dataSources: t.object,
  /** An array of the fields that will be rendered on the form. */
  fields: t.arrayOf(
    t.shape({
      /** The name of the field. */
      name: t.string,
      /** The label of the field that will be shown. */
      label: t.string,
      /** Flag that determines if the column can be used as a filter. */
      type: t.string,
      /** Flag that determines if the column is sortable.*/
      sortable: t.bool,
      /** Allows overriding the `HeaderCell`, `BodyCell`, and `FooterCell` for a given column. */
      components: t.shape({
        HeaderCell: t.func,
        BodyCell: t.func,
        FooterCell: t.func,
      }),
    }),
  ).isRequired,
  /** Add additional fields to a form. */
  addFields: t.arrayOf(
    t.shape({
      /** The label that will be rendered for the field. */
      label: t.string,
      /** Allows overriding  */
      components: t.shape({}),
    }),
  ),
  /** Allow overriding the fields shown and in which order. */
  fieldSet: t.oneOf([t.arrayOf(t.string), t.func]),
  components: t.shape({}),

  /** The Submit event called after the form is submitted. */
  onSubmit: t.func,
  /** The child of this component should be a function which renders the form layout. */
  children: t.func,
};

const defaultProps = {
  visible: true,
};

Form.defaultProps = defaultProps;

FormImpl.displayName = 'FormImpl';
