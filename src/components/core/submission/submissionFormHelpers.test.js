import { Map } from 'immutable';
import { evaluateExpression } from './submissionFormHelpers';

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

  test('with missing value', () => {
    const expression = 'values("First Name") === "Alyx"';
    const values = Map({ 'First Name': 'Alyx' });
    expect(() => evaluateExpression(expression, values)).toThrow('Something');
  });
});
