import { defineFilter } from './SearchBuilder';

describe('defineFilter', () => {
  const person = {
    firstName: 'Alex',
    lastName: 'Zen',
  };

  test('equals', () => {
    const fn = defineFilter()
      .equals('firstName', 'name')
      .end();
    expect(fn(person, { name: 'Alex' })).toBe(true);
    expect(fn(person, { name: 'ALEX' })).toBe(false);
    expect(fn(person, { name: 'Ale' })).toBe(false);
    expect(fn({ firstName: '\u00C5af' }, { name: '\u00E5af' })).toBe(false);
  });

  test('equals caseInsensitive', () => {
    const fn = defineFilter(true)
      .equals('firstName', 'name')
      .end();
    expect(fn(person, { name: 'Alex' })).toBe(true);
    expect(fn(person, { name: 'ALEX' })).toBe(true);
    expect(fn(person, { name: 'Ale' })).toBe(false);
    expect(fn({ firstName: '\u00C5af' }, { name: '\u00E5af' })).toBe(true);
  });

  test('multiple equals', () => {
    const fn = defineFilter()
      .equals('firstName', 'fname')
      .equals('lastName', 'lname')
      .end();
    expect(fn(person, { fname: 'Alex', lname: 'Zen' })).toBe(true);
    expect(fn(person, { fname: 'Ale', lname: 'Zen' })).toBe(false);
  });

  test('startsWith', () => {
    const fn = defineFilter()
      .startsWith('firstName', 'name')
      .end();
    expect(fn(person, { name: 'Alex' })).toBe(true);
    expect(fn(person, { name: 'Ale' })).toBe(true);
    expect(fn(person, { name: 'ALE' })).toBe(false);
    expect(fn(person, { name: 'Alexa' })).toBe(false);
  });

  test('startsWith caseInsensitive', () => {
    const fn = defineFilter(true)
      .startsWith('firstName', 'name')
      .end();
    expect(fn(person, { name: 'Alex' })).toBe(true);
    expect(fn(person, { name: 'Ale' })).toBe(true);
    expect(fn(person, { name: 'ALE' })).toBe(true);
    expect(fn(person, { name: 'Alexa' })).toBe(false);
  });

  test('in', () => {
    const fn = defineFilter()
      .in('firstName', 'names')
      .end();
    expect(fn(person, { names: ['Alex', 'Sam'] })).toBe(true);
    expect(fn(person, { names: ['ALEX', 'Same'] })).toBe(false);
    expect(fn(person, { names: ['Ale', 'Same'] })).toBe(false);
  });

  test('in caseInsensitive', () => {
    const fn = defineFilter(true)
      .in('firstName', 'names')
      .end();
    expect(fn(person, { names: ['Alex', 'Sam'] })).toBe(true);
    expect(fn(person, { names: ['ALEX', 'Same'] })).toBe(true);
    expect(fn(person, { names: ['Ale', 'Same'] })).toBe(false);
  });

  test('greaterThan', () => {
    const fn = defineFilter()
      .greaterThan('firstName', 'min')
      .end();
    expect(fn(person, { min: 'Aa' })).toBe(true);
    // "aa" > "Alex"
    expect(fn(person, { min: 'aa' })).toBe(false);
    expect(fn(person, { min: 'Alex' })).toBe(false);
    expect(fn(person, { min: 'Az' })).toBe(false);
  });

  test('greaterThan caseInsensitive', () => {
    const fn = defineFilter(true)
      .greaterThan('firstName', 'min')
      .end();
    expect(fn(person, { min: 'Aa' })).toBe(true);
    // "aa" > "Alex" but "alex" > "aa"
    expect(fn(person, { min: 'aa' })).toBe(true);
    expect(fn(person, { min: 'Alex' })).toBe(false);
    expect(fn(person, { min: 'Az' })).toBe(false);
  });

  test('greaterThanOrEquals', () => {
    const fn = defineFilter()
      .greaterThanOrEquals('firstName', 'min')
      .end();
    expect(fn(person, { min: 'Aa' })).toBe(true);
    // "aa" > "Alex"
    expect(fn(person, { min: 'aa' })).toBe(false);
    expect(fn(person, { min: 'Alex' })).toBe(true);
    expect(fn(person, { min: 'alex' })).toBe(false);
    expect(fn(person, { min: 'Az' })).toBe(false);
  });

  test('greaterThanOrEquals caseInsensitive', () => {
    const fn = defineFilter(true)
      .greaterThanOrEquals('firstName', 'min')
      .end();
    expect(fn(person, { min: 'Aa' })).toBe(true);
    // "aa" > "Alex" but "alex" > "aa"
    expect(fn(person, { min: 'aa' })).toBe(true);
    expect(fn(person, { min: 'Alex' })).toBe(true);
    expect(fn(person, { min: 'alex' })).toBe(true);
    expect(fn(person, { min: 'Az' })).toBe(false);
  });

  test('lessThan', () => {
    const fn = defineFilter()
      .lessThan('firstName', 'max')
      .end();
    expect(fn(person, { max: 'Az' })).toBe(true);
    // "AZ" < "Alex"
    expect(fn(person, { max: 'AZ' })).toBe(false);
    expect(fn(person, { max: 'Alex' })).toBe(false);
    expect(fn(person, { max: 'Aa' })).toBe(false);
  });

  test('lessThan caseInsensitive', () => {
    const fn = defineFilter(true)
      .lessThan('firstName', 'max')
      .end();
    expect(fn(person, { max: 'Az' })).toBe(true);
    // "AZ" < "Alex"
    expect(fn(person, { max: 'AZ' })).toBe(true);
    expect(fn(person, { max: 'Alex' })).toBe(false);
    expect(fn(person, { max: 'Aa' })).toBe(false);
  });

  test('lessThanOrEquals', () => {
    const fn = defineFilter()
      .lessThanOrEquals('firstName', 'max')
      .end();
    expect(fn(person, { max: 'Az' })).toBe(true);
    // "aa" > "Alex"
    expect(fn(person, { max: 'aa' })).toBe(true);
    expect(fn(person, { max: 'Alex' })).toBe(true);
    expect(fn(person, { max: 'Aa' })).toBe(false);
  });

  test('lessThanOrEquals caseInsensitive', () => {
    const fn = defineFilter(true)
      .lessThanOrEquals('firstName', 'max')
      .end();
    expect(fn(person, { max: 'Az' })).toBe(true);
    // "aa" < "alex"
    expect(fn(person, { max: 'aa' })).toBe(false);
    expect(fn(person, { max: 'Alex' })).toBe(true);
    expect(fn(person, { max: 'Aa' })).toBe(false);
  });

  test('between', () => {
    const fn = defineFilter()
      .between('firstName', 'min', 'max')
      .end();
    expect(fn(person, { min: 'Aa', max: 'Az' })).toBe(true);
    // min inclusive
    expect(fn(person, { min: 'Alex', max: 'Az' })).toBe(true);
    // max exclusive
    expect(fn(person, { min: 'Aa', max: 'Alex' })).toBe(false);
    // case sensitive
    expect(fn(person, { min: 'aa', max: 'az' })).toBe(false);
    expect(fn(person, { min: 'Aa', max: 'Ab' })).toBe(false);
  });

  test('between caseInsensitive', () => {
    const fn = defineFilter(true)
      .between('firstName', 'min', 'max')
      .end();
    expect(fn(person, { min: 'Aa', max: 'Az' })).toBe(true);
    expect(fn(person, { min: 'aa', max: 'az' })).toBe(true);
    expect(fn(person, { min: 'Aa', max: 'Ab' })).toBe(false);
  });

  test('or', () => {
    const fn = defineFilter(false, 'or')
      .equals('firstName', 'name1')
      .equals('firstName', 'name2')
      .end();
    expect(fn(person, { name1: 'Alex', name2: 'Other' })).toBe(true);
    expect(fn(person, { name1: 'Other', name2: 'Alex' })).toBe(true);
    expect(fn(person, { name1: 'Other', name2: 'zzz' })).toBe(false);
  });

  test('nested ands / ors', () => {
    const fn = defineFilter()
      .equals('lastName', 'lname')
      .or()
      .equals('firstName', 'name1')
      .equals('firstName', 'name2')
      .end()
      .end();
    expect(fn(person, { name1: 'Alex', name2: 'Other', lname: 'Zen' })).toBe(
      true,
    );
    expect(fn(person, { name1: 'Other', name2: 'Alex', lname: 'Zen' })).toBe(
      true,
    );
    expect(fn(person, { name1: 'Other', name2: 'zzz', lname: 'Zen' })).toBe(
      false,
    );
  });

  test('nested ands / ors caseInsensitive', () => {
    const fn = defineFilter(true)
      .equals('lastName', 'lname')
      .or()
      .equals('firstName', 'name1')
      .equals('firstName', 'name2')
      .end()
      .end();
    expect(fn(person, { name1: 'alex', name2: 'Other', lname: 'zen' })).toBe(
      true,
    );
    expect(fn(person, { name1: 'Other', name2: 'alex', lname: 'zen' })).toBe(
      true,
    );
    expect(fn(person, { name1: 'Other', name2: 'zzz', lname: 'zen' })).toBe(
      false,
    );
  });

  describe('empty filters', function() {
    test('equals', () => {
      const fn = defineFilter()
        .equals('firstName', 'name')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { name: '' })).toBe(true);
      expect(fn(person, { name: null })).toBe(true);
    });

    test('equals strict', () => {
      const fn = defineFilter()
        .equals('firstName', 'name', true)
        .end();
      expect(fn(person, {})).toBe(false);
      expect(fn(person, { name: '' })).toBe(false);
      expect(fn(person, { name: null })).toBe(false);
      expect(fn({}, {})).toBe(true);
      expect(fn({ firstName: '' }, { name: '' })).toBe(true);
      expect(fn({ firstName: null }, { name: null })).toBe(true);
    });

    test('in', () => {
      const fn = defineFilter()
        .in('firstName', 'names')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { names: [] })).toBe(true);
      expect(fn(person, { names: null })).toBe(true);
    });

    test('in strict', () => {
      const fn = defineFilter()
        .in('firstName', 'names', true)
        .end();
      expect(fn(person, {})).toBe(false);
      expect(fn(person, { names: [] })).toBe(false);
      expect(fn(person, { names: null })).toBe(false);
      expect(fn({}, { names: null })).toBe(false);
      expect(fn({ firstName: '' }, { names: null })).toBe(false);
      expect(fn({ firstName: null }, { names: null })).toBe(false);
      expect(fn({}, { names: [] })).toBe(false);
      expect(fn({ firstName: '' }, { names: [] })).toBe(false);
      expect(fn({ firstName: null }, { names: [] })).toBe(false);
    });

    test('startsWith', () => {
      const fn = defineFilter()
        .startsWith('firstName', 'name')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { name: '' })).toBe(true);
      expect(fn(person, { name: null })).toBe(true);
    });

    test('greaterThan', () => {
      const fn = defineFilter()
        .greaterThan('firstName', 'min')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: '' })).toBe(true);
      expect(fn(person, { min: null })).toBe(true);
    });

    test('greaterThanOrEquals', () => {
      const fn = defineFilter()
        .greaterThanOrEquals('firstName', 'min')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: '' })).toBe(true);
      expect(fn(person, { min: null })).toBe(true);
    });

    test('lessThan', () => {
      const fn = defineFilter()
        .lessThan('firstName', 'max')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { max: '' })).toBe(true);
      expect(fn(person, { max: null })).toBe(true);
    });

    test('lessThanOrEquals', () => {
      const fn = defineFilter()
        .lessThanOrEquals('firstName', 'max')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { max: '' })).toBe(true);
      expect(fn(person, { max: null })).toBe(true);
    });

    test('between', () => {
      const fn = defineFilter()
        .between('firstName', 'min', 'max')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: '', max: 'z' })).toBe(true);
      expect(fn(person, { min: null, max: 'z' })).toBe(true);
      expect(fn(person, { min: 'a', max: '' })).toBe(true);
      expect(fn(person, { min: 'a', max: null })).toBe(true);
    });
  });

  describe('empty values', function() {
    // TODO: Write test cases handling lvalue being undefined, null, ''
  });
});
