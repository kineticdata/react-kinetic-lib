import { List, Map } from 'immutable';
import { isEmpty, validateField } from './Form';
import { Field } from './Form.models';

describe('isEmpty', () => {
  test('returns true if null', () => {
    expect(isEmpty(null)).toBe(true);
  });
  test('returns true if empty string', () => {
    expect(isEmpty('')).toBe(true);
  });
  test('returns true if undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });
  test('returns true if empty map', () => {
    expect(isEmpty(Map())).toBe(true);
  });
  test('returns false if populated string', () => {
    expect(isEmpty('foo')).toBe(false);
  });
  test('returns false if populated Map', () => {
    expect(isEmpty(Map({ foo: 'bar' }))).toBe(false);
  });
});

describe('validateFields', () => {
  describe('check required', () => {
    test('has error when required and value is empty string', () => {
      const field = Field({ name: 'First Name', required: true, value: '' });
      expect(validateField({})(field).errors).toEqual(
        List(['This field is required']),
      );
    });

    test('has custom error when required and value is empty string', () => {
      const field = Field({
        name: 'First Name',
        required: true,
        requiredMessage: 'HEY!',
        value: '',
      });
      expect(validateField({})(field).errors).toEqual(List(['HEY!']));
    });

    test('no error when required and value is populated string', () => {});
    test('has error when required function evaluates to true and value is empty string', () => {});
  });

  describe('check pattern', () => {
    const field = Field({ name: 'First Name', pattern: /\d+/, value: '' });
    test('no error when pattern but value is empty string', () => {});
    test('no error when pattern and string matches', () => {});
    test('error when pattern and string does not match', () => {});
    test('pattern message used if defined', () => {});
  });

  describe('check custom constraint', () => {
    const field = Field({
      name: 'First Name',
      constraint: () => true,
      value: '',
    });
    test('no error when constraint evaluates to true', () => {});
    test('error when constraint evaluates to false', () => {});
    test('constraint message used if defined ', () => {});
  });
});
