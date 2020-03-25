import { fromJS, Map } from 'immutable';
import { evaluateExpression, evaluateTemplate } from './submissionFormHelpers';

describe('evaluateExpression', () => {
  test('returns boolean value', () => {
    expect(evaluateExpression('1 === 2', Map())).toBe(false);
    expect(evaluateExpression('2 === 2', Map())).toBe(true);
  });

  test('returns false when falsey value is the result', () => {
    expect(evaluateExpression('undefined', Map())).toBe(false);
    expect(evaluateExpression('null', Map())).toBe(false);
    expect(evaluateExpression('0', Map())).toBe(false);
    expect(evaluateExpression('""', Map())).toBe(false);
  });

  test('returns true when truthy value is the result', () => {
    expect(evaluateExpression('"not empty"', Map())).toBe(true);
    expect(evaluateExpression('2', Map())).toBe(true);
  });

  test('with existing value', () => {
    const expression = 'values("First Name") === "Alyx"';
    const values = Map({ 'First Name': 'Alyx' });
    expect(evaluateExpression(expression, values)).toBe(true);
  });

  // test('with missing value', () => {
  //   const expression = 'values("First Name") === "Alyx"';
  //   const values = Map({ 'First Name': 'Alyx' });
  //   expect(() => evaluateExpression(expression, values)).toThrow('Something');
  // });
});

describe('evaluateTemplate', () => {
  const bindings = {
    values: Map({ 'First Name': 'Shayne' }),
    Person: Map({ 'First Name': 'Morgan' }),
  };
  test('constant', () => {
    expect(evaluateTemplate('Hello World', bindings)).toEqual('Hello World');
  });

  test('basic expression with no bindings', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(evaluateTemplate('${2 + 2}', bindings)).toEqual('4');
  });

  test('null value', () => {
    expect(evaluateTemplate('null', bindings)).toEqual('null');
  });

  test('uses a value', () => {
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      evaluateTemplate('Hello ${values("First Name")}!', bindings),
    ).toEqual('Hello Shayne!');
  });

  // test('uses an invalid value', () => {
  //   const bindings = { values: Map({ 'First Name': 'Shayne' }) };
  //   expect(
  //     // eslint-disable-next-line no-template-curly-in-string
  //     () => evaluateTemplate('Hello ${values("Last Name")}!', bindings),
  //   ).toThrow('something');
  // });

  test('uses a bridged resource', () => {
    expect(
      evaluateTemplate('Hello ${resources("Person:First Name")}!', bindings),
    ).toEqual('Hello Morgan!');
  });
});
