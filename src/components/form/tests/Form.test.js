import React from 'react';
import { KineticLib } from '../../../index';
import { store } from '../../../store';
import { generateForm, setValue, submitForm } from '../Form';
import { mockFieldConfig } from './components';
import { mount } from 'enzyme';

const FORM_KEY = 'test';

const mountForm = ({
  dataSources = () => ({}),
  fields = () => () => [],
  handleSubmit = () => {},
  formOptions = {},
  ...formProps
}) => {
  // Generate a Form using the options defined by the particular test case.
  const Form = generateForm({
    dataSources,
    fields,
    formOptions: Object.keys(formOptions),
    handleSubmit,
  });
  // Wrap the enyzme mount call with a promise that will be resolved when the
  // form is initialized (most of the test cases need to wait for this).
  return new Promise(resolve => {
    const result = mount(
      <KineticLib components={{ fields: mockFieldConfig }}>
        <Form formKey={FORM_KEY} uncontrolled {...formProps} {...formOptions} />
      </KineticLib>,
    );
    const ready = () => !!store.getState().getIn(['forms', FORM_KEY, 'fields']);
    if (ready()) {
      result.update();
      resolve(result);
    } else {
      const unsub = store.subscribe(() => {
        if (ready()) {
          result.update();
          resolve(result);
          // Remove the store listener since we're done.
          unsub();
        }
      });
    }
  });
};

describe('dataSources', () => {
  test('simple', async () => {
    const dependencyFn = jest.fn(() => 'Test Arg');
    const messageFn = jest.fn(() => Promise.resolve('Hello World!'));
    const messageParams = jest.fn(
      ({ dependency }) => dependency && [dependency],
    );
    const result = await mountForm({
      dataSources: () => ({
        dependency: {
          fn: dependencyFn,
          params: [],
        },
        message: {
          fn: messageFn,
          params: messageParams,
        },
      }),
      fields: () => ({ message }) =>
        message && [
          {
            name: 'test',
            type: 'text',
            initialValue: message,
          },
        ],
    });
    expect(result.find('FormLayout')).toMatchSnapshot();
    // should be called once
    expect(dependencyFn.mock.calls).toMatchSnapshot();
    // should be called once with the result dependencyFn
    expect(messageFn.mock.calls).toMatchSnapshot();
    // should be called several times as bindings change
    expect(messageParams.mock.calls).toMatchSnapshot();
    result.unmount();
  });
});

describe('fields', () => {
  describe('constraint', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('constraintMessage', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('enabled', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('helpText', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('initialValue', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('label', () => {
    test('given a string value', async () => {
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            label: 'Testing Label',
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      result.unmount();
    });

    test('given a null value', async () => {
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            label: null,
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      result.unmount();
    });

    test('given a function value', async () => {
      const labelFn = jest.fn(bindings => 'Functional Label');
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            initialValue: 'foo',
            label: labelFn,
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      expect(labelFn.mock.calls).toMatchSnapshot();
      result.unmount();
    });
  });

  describe('language', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('name', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('onChange', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('options', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('pattern', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('patternMessage', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('placeholder', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('renderAttributes', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('required', () => {
    test('given true', async () => {
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            required: true,
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      result.unmount();
    });
    test('given false', async () => {
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            required: false,
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      result.unmount();
    });
    test('has value', async () => {
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            required: true,
            initialValue: 'Test',
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      result.unmount();
    });
    test('given function that returns true', async () => {
      const requiredFn = jest.fn(bindings => true);
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            required: requiredFn,
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      expect(requiredFn.mock.calls).toMatchSnapshot();
      expect(requiredFn.mock.calls).toMatchSnapshot();
      result.unmount();
    });
    test('given function that returns false', async () => {
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            required: () => false,
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      result.unmount();
    });
    test('given function that returns null', async () => {
      const result = await mountForm({
        fields: () => () => [
          {
            name: 'test',
            type: 'text',
            required: () => null,
          },
        ],
      });
      expect(result.find('TextFieldMock')).toMatchSnapshot();
      result.unmount();
    });
  });

  describe('requiredMessage', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('search', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('serialize', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('transient', function() {
    test('>>=TODO>>=', async () => {});
  });

  describe('type', () => {
    describe('attributes', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('checkbox', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('code', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('form', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('form-multi', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('password', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('radio', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('table', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('team', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('team-multi', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('select', () => {
      test('no options', async () => {
        const result = await mountForm({
          fields: () => () => [
            {
              name: 'test',
              type: 'select',
            },
          ],
        });
        expect(result.find('SelectFieldMock')).toMatchSnapshot();
        result.unmount();
      });
    });

    describe('select-multi', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('text', () => {
      test('no options', async () => {
        const result = await mountForm({
          fields: () => () => [
            {
              name: 'test',
              type: 'text',
            },
          ],
        });
        expect(result.find('TextFieldMock')).toMatchSnapshot();
        result.unmount();
      });
    });

    describe('text-multi', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('user', function() {
      test('>>=TODO>>=', async () => {});
    });

    describe('user-multi', function() {
      test('>>=TODO>>=', async () => {});
    });
  });

  describe('visible', function() {
    test('>>=TODO>>=', async () => {});
  });
});

describe('setValue', function() {
  test('triggerChange', async () => {
    const onChangeMock = jest.fn();
    const result = await mountForm({
      dataSources: () => ({
        test: {
          fn: () => 2,
          params: [],
        },
      }),
      fields: () => () => [
        { name: 'test', type: 'text', onChange: onChangeMock },
      ],
    });
    setValue(FORM_KEY, 'test', 'Hello World!');
    result.update();
    // The Field should be dirty and the value should be updated.
    expect(result.find('TextFieldMock')).toMatchSnapshot();
    // onChange should be called with the current bindings
    // (values and dataSources).
    expect(onChangeMock.mock.calls).toMatchSnapshot();
  });

  test('triggerChange false', async () => {
    const onChangeMock = jest.fn();
    const result = await mountForm({
      fields: () => () => [
        { name: 'test', type: 'text', onChange: onChangeMock },
      ],
    });
    setValue(FORM_KEY, 'test', 'Hello World!', false);
    result.update();
    // The Field should be dirty and the value should be updated.
    expect(result.find('TextFieldMock')).toMatchSnapshot();
    // onChange should not have been called
    expect(onChangeMock.mock.calls.length).toBe(0);
  });
});

describe('handleSubmit', () => {
  test('happy path', async () => {
    const submitFn = jest.fn(() => Promise.resolve('Success!'));
    const saveFn = jest.fn();
    const onSave = jest.fn(() => saveFn);
    const handleSubmit = jest.fn(() => submitFn);

    const result = await mountForm({
      fields: () => () => [{ name: 'test2', type: 'text' }],
      formOptions: { testOption: 'Foo' },
      handleSubmit,
      onSave,
    });

    submitForm(FORM_KEY, {});

    // FormButtons submitting prop should be set to true
    result.update();
    expect(result.find('FormLayout')).toMatchSnapshot();

    await submitFn();

    // FormButtons submitting prop should be false
    result.update();
    expect(result.find('FormLayout')).toMatchSnapshot();

    // check mocks
    //
    // both should be called with formOptions provided above
    expect(handleSubmit.mock.calls).toMatchSnapshot();
    expect(onSave.mock.calls).toMatchSnapshot();
    // should be called with values map and bindings object
    expect(submitFn.mock.calls).toMatchSnapshot();
    // should be called with resolved value of submitFn
    expect(saveFn.mock.calls).toMatchSnapshot();

    // cleanup
    //
    result.unmount();
  });

  test('submit error', async () => {
    const submitFn = jest.fn(() => Promise.reject('This is a test error'));
    const handleSubmit = jest.fn(() => submitFn);
    const result = await mountForm({ handleSubmit });
    submitForm('test', {});
    await submitFn().catch(e => e);
    result.update();
    expect(result.find('FormLayout')).toMatchSnapshot();
    result.unmount();
  });

  test('submit unexpected error, we expect the promise to reject with a string', async () => {
    const submitFn = jest.fn(() => Promise.reject({}));
    const handleSubmit = jest.fn(() => submitFn);
    const result = await mountForm({ handleSubmit });
    submitForm('test', {});
    await submitFn().catch(e => e);
    result.update();
    expect(result.find('FormLayout')).toMatchSnapshot();
    result.unmount();
  });

  test('submit error calls onError', async () => {
    const submitFn = jest.fn(() => Promise.reject('TEST ERROR'));
    const handleSubmit = jest.fn(() => submitFn);
    // This mock should be called with the string in the rejected promise above
    const errorFn = jest.fn();
    // This mock should be called with the formOptions provided below
    const onError = jest.fn(() => errorFn);
    const result = await mountForm({
      formOptions: { testOption: 'Foo' },
      handleSubmit,
      onError,
    });
    submitForm('test', {});
    await submitFn().catch(e => e);
    expect(onError.mock.calls).toMatchSnapshot();
    expect(errorFn.mock.calls).toMatchSnapshot();
    result.unmount();
  });
});
