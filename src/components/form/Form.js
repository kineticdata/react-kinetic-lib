import React, { Component } from 'react';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import t from 'prop-types';
import {
  fromJS,
  is,
  isImmutable,
  List,
  Map,
  OrderedMap,
  OrderedSet,
} from 'immutable';
import { action, connect, dispatch, regHandlers, regSaga } from '../../store';
import { ComponentConfigContext } from '../common/ComponentConfigContext';
import { generateKey } from '../../helpers';
import { DATA_SOURCE_STATUS } from './Form.models';
import {
  createField,
  createFormState,
  resolveFieldConfig,
} from './Form.helpers';
import { Field } from './Field';

export const getTimestamp = () => Math.floor(new Date().getTime() / 1000);

export const isEmpty = value =>
  value === null ||
  value === undefined ||
  value === '' ||
  (isImmutable(value) && value.isEmpty());

const reinitializeFields = fields =>
  fields.map(field =>
    field.merge({
      initialValue: field.value,
      dirty: false,
      touched: false,
    }),
  );

const resetValues = fields =>
  fields.map(field =>
    field.merge({
      value: field.initialValue,
      dirty: false,
      touched: false,
    }),
  );

export const checkRequired = field =>
  field.required && isEmpty(field.value)
    ? List([field.requiredMessage])
    : List();

export const checkPattern = field =>
  field.pattern &&
  field.type === 'text' &&
  field.value !== '' &&
  !field.value.match(field.pattern)
    ? List([field.patternMessage])
    : List();

export const checkConstraint = bindings => field =>
  field.constraint && !field.constraint(bindings)
    ? List([field.constraintMessage])
    : List();

export const validateFields = bindings => field =>
  field.set(
    'errors',
    List([checkRequired, checkPattern, checkConstraint(bindings)]).flatMap(fn =>
      fn(field),
    ),
  );

export const evaluateFieldProps = bindings => field =>
  field.functions
    .filter(fn => !!fn)
    .reduce(
      (reduction, fn, prop) => reduction.set(prop, fromJS(fn(bindings))),
      field,
    );

const initializeFields = formState => {
  if (!formState.fields) {
    const fields = formState.fieldsFn(formState.bindings);
    if (!!fields) {
      const fieldConfig = resolveFieldConfig(
        fields,
        formState.addFields,
        formState.alterFields,
      );
      return buildBindings(
        formState.set(
          'fields',
          fieldConfig.map(createField(formState.formKey)),
        ),
      );
    }
  }
  return formState;
};

const buildBindings = formState =>
  formState.set(
    'bindings',
    formState.dataSources
      .filter(dataSource => dataSource.status === DATA_SOURCE_STATUS.RESOLVED)
      .map(dataSource => dataSource.data)
      .merge(
        formState.fields
          ? { values: formState.fields.map(field => field.value) }
          : {},
      )
      .toObject(),
  );

const evaluateDataSources = formState =>
  formState.update('dataSources', dataSources =>
    dataSources.map(dataSource => {
      if (dataSource.paramsFn) {
        const rawParams = dataSource.paramsFn(formState.bindings);
        return dataSource.merge({
          rawParams,
          params: rawParams && fromJS(rawParams),
          prevParams: dataSource.params,
        });
      } else {
        return dataSource;
      }
    }),
  );

const evaluateFields = formState =>
  formState.fields
    ? formState.update('fields', fields =>
        fields
          .map(evaluateFieldProps(formState.bindings))
          .map(validateFields(formState.bindings)),
      )
    : formState;

const digest = formState =>
  [buildBindings, initializeFields, evaluateFields, evaluateDataSources].reduce(
    (reduction, fn) => fn(reduction),
    formState,
  );

regHandlers({
  MOUNT_FORM: (state, { payload: { formKey } }) =>
    state.setIn(['forms', formKey], null),
  UNMOUNT_FORM: (state, { payload: { formKey } }) =>
    state.deleteIn(['forms', formKey]),
  CONFIGURE_FORM: (state, { payload }) =>
    state.getIn(['forms', payload.formKey]) !== null
      ? state
      : state.setIn(
          ['forms', payload.formKey],
          digest(createFormState(payload)),
        ),
  SET_VALUE: (state, { payload: { formKey, name, value } }) =>
    state
      .updateIn(['forms', formKey, 'fields', name], field =>
        field.merge({
          value,
          touched: true,
          dirty: !is(value, field.initialValue),
        }),
      )
      .updateIn(['forms', formKey], digest),
  FOCUS_FIELD: (state, { payload: { formKey, name } }) =>
    state.setIn(['forms', formKey, 'fields', name, 'focused'], true),
  BLUR_FIELD: (state, { payload: { formKey, name } }) =>
    state.mergeIn(['forms', formKey, 'fields', name], {
      focused: false,
      touched: true,
    }),
  CALL_DATA_SOURCE: (state, { payload: { formKey, name } }) =>
    state.mergeIn(['forms', formKey, 'dataSources', name], {
      status: DATA_SOURCE_STATUS.PENDING,
    }),
  RESOLVE_DATA_SOURCE: (state, { payload: { formKey, name, data } }) =>
    state
      .updateIn(['forms', formKey, 'dataSources', name], dataSource =>
        dataSource.merge({
          data: fromJS(
            dataSource.transform ? dataSource.transform(data) : data,
          ),
          status: DATA_SOURCE_STATUS.RESOLVED,
        }),
      )
      .updateIn(['forms', formKey], digest),
  RESET: (state, { payload: { formKey } }) =>
    state.hasIn(['forms', formKey])
      ? state
          .updateIn(['forms', formKey, 'fields'], resetValues)
          .updateIn(['forms', formKey], digest)
      : state,
  SUBMIT: (state, { payload: { formKey } }) =>
    state.setIn(['forms', formKey, 'submitting'], true),
  SUBMIT_SUCCESS: (state, { payload: { formKey } }) =>
    state
      .setIn(['forms', formKey, 'submitting'], false)
      .setIn(['forms', formKey, 'error'], null)
      .updateIn(['forms', formKey, 'fields'], reinitializeFields)
      .updateIn(['forms', formKey], digest),
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
          fieldNames.includes(field.name) ? field.set('touched', true) : field,
        ),
      ),
});

const selectForm = formKey => state => state.getIn(['forms', formKey]);
const selectDataSource = (formKey, name) => state =>
  selectForm(formKey)(state).getIn(['dataSources', name]);

regSaga('CHECK_DATA_SOURCES', function*() {
  // Redux actions that should result in checking whether or not data sources
  // should be called.
  const checkActions = [
    'CONFIGURE_FORM',
    'REJECT_DATA_SOURCE',
    'RESET',
    'RESOLVE_DATA_SOURCE',
    'SET_VALUE',
    'SUBMIT_SUCCESS',
  ];
  // Looks at the params to see if the data source should be called.
  const shouldCall = (dataSource, name) =>
    (!dataSource.paramsFn &&
      dataSource.rawParams &&
      dataSource.status === DATA_SOURCE_STATUS.UNINITIALIZED) ||
    (dataSource.params && !dataSource.params.equals(dataSource.prevParams));
  // Builds the redux action that triggers a call of the data source.
  const callAction = formKey => (dataSource, name) =>
    put(action('CALL_DATA_SOURCE', { formKey, name }));

  // Putting the above pieces together to call data sources when appropriate.
  yield takeEvery(checkActions, function*({ payload: { formKey } }) {
    const formState = yield select(selectForm(formKey));
    if (formState) {
      yield all(
        formState.dataSources
          .filter(shouldCall)
          .map(callAction(formKey))
          .valueSeq()
          .toArray(),
      );
    }
  });
});

regSaga(
  takeEvery('CALL_DATA_SOURCE', function*({ payload: { formKey, name } }) {
    const { fn, rawParams } = yield select(selectDataSource(formKey, name));
    const data = yield call(fn, ...rawParams);
    const timestamp = yield call(getTimestamp);
    yield put(
      action('RESOLVE_DATA_SOURCE', { formKey, name, data, timestamp }),
    );
  }),
);

regSaga(
  takeEvery('SET_VALUE', function*({
    payload: { formKey, name, triggerChange },
  }) {
    if (triggerChange) {
      const { bindings, fields } = yield select(selectForm(formKey));
      const { onChange } = fields.get(name);
      if (onChange) {
        yield call(onChange, bindings, bindActions(formKey));
      }
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
    const { bindings, fields, onSubmit, onSave, onError } = yield select(
      selectForm(formKey),
    );

    const values = fields
      .filter(field => !field.transient && fieldSet.contains(field.name))
      .map(field =>
        field.serialize ? field.serialize(bindings) : field.value,
      );

    const errors = fields
      .map(field => field.errors)
      .filter(errors => !errors.isEmpty());

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

export const onFocus = ({ formKey, name }) => () => {
  dispatch('FOCUS_FIELD', { formKey, name });
};

export const onBlur = ({ formKey, name }) => () => {
  dispatch('BLUR_FIELD', { formKey, name });
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

export const onReset = formKey => () => {
  resetForm(formKey);
};

export const clearError = formKey => event => {
  dispatch('CLEAR_ERROR', { formKey });
};

export const mountForm = formKey => dispatch('MOUNT_FORM', { formKey });

export const unmountForm = formKey => dispatch('UNMOUNT_FORM', { formKey });

export const resetForm = formKey => dispatch('RESET', { formKey });

export const configureForm = config => dispatch('CONFIGURE_FORM', config);

// Wraps the FormImpl to handle the formKey behavior. If this is passed a
// formKey prop this wrapper is essentially a noop, but if it is not passed a
// formKey then it generates one and stores it as component state and passes
// that to FormImpl. When it generates its own form key it then mounts/unmounts
// the form state in its lifecycle methods. Note that we need a second component
// to do this because we need to use the form key in the mapStateToProps of the
// wrapped component.

/**
 * @component
 */
export class Form extends Component {
  constructor(props) {
    super(props);
    this.auto = !this.props.formKey;
    this.formKey = this.props.formKey || generateKey();
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
    const { components, ...props } = this.props;
    return (
      <ComponentConfigContext.Consumer>
        {config => (
          <FormImpl
            {...props}
            formKey={this.formKey}
            components={config.merge(Map(components).filter(c => !!c))}
          />
        )}
      </ComponentConfigContext.Consumer>
    );
  }
}

class FormImplComponent extends Component {
  checkConfigure() {
    if (this.props.formState === null) {
      configureForm(this.props);
    }
  }

  componentDidMount() {
    this.checkConfigure();
  }

  componentDidUpdate() {
    this.checkConfigure();
  }

  render() {
    const {
      addFields,
      alterFields,
      components,
      fields: fieldsFn,
      fieldSet,
      formKey,
      formState,
    } = this.props;
    const bindings = formState ? formState.bindings : {};
    const initialized = formState ? !!formState.fields : false;
    let form = null;
    if (initialized) {
      const { FormButtons, FormError, FormLayout } = components.toObject();
      const { error, fields, formOptions, submitting } = formState;
      // Build a map of components by field, merging the fields, addFields, and
      // alterFields options. Note that we get those from the parent props not
      // redux store because we want to see new components on HMR updates.
      const fieldComponents = resolveFieldConfig(
        fieldsFn(formOptions)(bindings),
        addFields,
        alterFields,
      )
        .filter(fieldConfig => fieldConfig.component)
        .map(fieldConfig => fieldConfig.component);

      const fullFieldSet = OrderedSet(fields.keySeq());
      const computedFieldSet = OrderedSet(
        !fieldSet
          ? fullFieldSet
          : typeof fieldSet === 'function'
          ? fieldSet(fullFieldSet)
          : fieldSet,
      );
      const formLayout = (
        <FormLayout
          formOptions={formOptions}
          fields={OrderedMap(
            computedFieldSet.map(name => [name, fields.get(name).toObject()]),
          ).map(({ eventHandlers, ...props }) => (
            <Field
              key={props.name}
              {...props}
              {...eventHandlers.toObject()}
              component={fieldComponents.get(props.name)}
              components={components}
            />
          ))}
          error={
            error && <FormError error={error} clear={clearError(formKey)} />
          }
          buttons={
            <FormButtons
              reset={onReset(formKey)}
              submit={onSubmit(formKey, computedFieldSet)}
              submitting={submitting}
              dirty={fields.some(field => field.dirty)}
            />
          }
          meta={fields.map(field =>
            Map({
              visible: field.visible,
            }),
          )}
        />
      );
      form = this.props.noFormTag ? (
        formLayout
      ) : (
        <form onSubmit={onSubmit(formKey, computedFieldSet)}>{formLayout}</form>
      );
    }
    return typeof this.props.children === 'function'
      ? this.props.children({ bindings, form, initialized })
      : form;
  }
}

export const mapStateToProps = (state, props) => ({
  formState: selectForm(props.formKey)(state),
});

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
