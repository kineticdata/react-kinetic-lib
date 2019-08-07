import { operations, isValueEmpty } from './Table.redux';
import { List } from 'immutable';

describe('<Table /> redux', () => {
  describe('setup', () => {
    test('true dat', () => {
      expect(true).toBeTruthy();
    });
  });

  describe('client-side operations', () => {
    test('startsWith', () => {
      const op = operations.get('startsWith');
      expect(op('currentValue', 'cur')).toBeTruthy();
    });
    test('equals', () => {
      const op = operations.get('equals');
      expect(op('currentValue', 'cur')).toBeFalsy();
      expect(op('currentValue', 'currentValue')).toBeTruthy();
      expect(op('CURRENTVALUE', 'currentValue')).toBeTruthy();
      expect(op(1, 2)).toBeFalsy();
      expect(op(1, 1)).toBeTruthy();
    });
    test('lt', () => {
      const op = operations.get('lt');
      expect(op(10, 9)).toBeFalsy();
      expect(op(10, 11)).toBeTruthy();
    });
    test('lteq', () => {
      const op = operations.get('lteq');
      expect(op(10, 9)).toBeFalsy();
      expect(op(10, 10)).toBeTruthy();
      expect(op(10, 11)).toBeTruthy();
    });
    test('gt', () => {
      const op = operations.get('gt');
      expect(op(10, 9)).toBeTruthy();
      expect(op(10, 11)).toBeFalsy();
    });
    test('gteq', () => {
      const op = operations.get('gteq');
      expect(op(10, 9)).toBeTruthy();
      expect(op(10, 10)).toBeTruthy();
      expect(op(10, 11)).toBeFalsy();
    });
    test('between', () => {
      const op = operations.get('between');
      expect(op(10, List([1, 20]))).toBeTruthy();
      expect(op(1, List([1, 20]))).toBeTruthy();
      expect(op(20, List([1, 20]))).toBeFalsy();
      expect(op(21, List([1, 20]))).toBeFalsy();
      expect(op(0, List([1, 20]))).toBeFalsy();
    });
    test('in', () => {
      const op = operations.get('in');
      expect(op('a', List(['a', 'b', 'c']))).toBeTruthy();
      expect(op('A', List(['a', 'b', 'c']))).toBeTruthy();
      expect(op('b', List(['a', 'b', 'c']))).toBeTruthy();
      expect(op('c', List(['a', 'b', 'c']))).toBeTruthy();
      expect(op('d', List(['a', 'b', 'c']))).toBeFalsy();
    });
  });

  describe('#isValueEmpty', () => {
    test('is empty when undefined', () => {
      let a;
      expect(isValueEmpty(a)).toBeTruthy();
    });
    test('is empty when empty string', () => {
      let a = '';
      expect(isValueEmpty(a)).toBeTruthy();
    });
    test('is not empty when it is string', () => {
      let a = 'a';
      expect(isValueEmpty(a)).toBeFalsy();
    });
    test('is empty when empty List', () => {
      let a = List();
      expect(isValueEmpty(a)).toBeTruthy();
    });
    test('is empty when List of empty strings', () => {
      let a = List(['', '']);
      expect(isValueEmpty(a)).toBeTruthy();
    });
    test('is not empty when List of items', () => {
      let a = List(['a', 'b']);
      expect(isValueEmpty(a)).toBeFalsy();
      a = List([1, 2]);
      expect(isValueEmpty(a)).toBeFalsy();
    });
  });
});
