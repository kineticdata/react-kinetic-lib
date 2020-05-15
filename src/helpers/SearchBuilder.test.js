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

  // With non-empty filter values and object values it should behave the same
  // as the `equals` without strict.
  test('equals strict', () => {
    const fn = defineFilter()
      .equals('firstName', 'name', true)
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

  // With non-empty filter values and object values it should behave the same
  // as the `in` without strict.
  test('in strict', () => {
    const fn = defineFilter()
      .in('firstName', 'names', true)
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

  test('in invalid filter value type', () => {
    const fn = defineFilter()
      .in('firstName', 'names')
      .end();
    expect(() => {
      fn(person, { names: 'Invalid' });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Invalid filter value for in operation of names filter. Got \\"Invalid\\". Require an array."`,
    );
    expect(() => {
      fn(person, { names: '' });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Invalid filter value for in operation of names filter. Got \\"\\". Require an array."`,
    );
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

  // With non-empty filter values and object values it should behave the same
  // as the `greaterThan` without strict.
  test('greaterThan strict', () => {
    const fn = defineFilter()
      .greaterThan('firstName', 'min', true)
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

  // With non-empty filter values and object values it should behave the same
  // as the `greaterThanOrEquals` without strict.
  test('greaterThanOrEquals strict', () => {
    const fn = defineFilter()
      .greaterThanOrEquals('firstName', 'min', true)
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

  // With non-empty filter values and object values it should behave the same
  // as the `lessThan` without strict.
  test('lessThan strict', () => {
    const fn = defineFilter()
      .lessThan('firstName', 'max', true)
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

  // With non-empty filter values and object values it should behave the same
  // as the `lessThanOrEquals` without strict.
  test('lessThanOrEquals strict', () => {
    const fn = defineFilter()
      .lessThanOrEquals('firstName', 'max', true)
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
    // tests a min - max range that relies on case sensitivity
    expect(fn(person, { min: 'A', max: 'a' })).toBe(true);
  });

  // With non-empty filter values and object values it should behave the same
  // as the `between` without strict.
  test('between', () => {
    const fn = defineFilter()
      .between('firstName', 'min', 'max', true)
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
    expect(() => {
      fn(person, { min: 'A', max: 'a' });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Invalid filter values for between operation of min and max. Min \\"A\\" not less than max \\"a\\" (caseInsensitive)"`,
    );
  });

  test('between invalid', () => {
    const fn = defineFilter(true)
      .between('firstName', 'min', 'max')
      .end();
    expect(() => {
      fn(person, { min: 'z', max: 'a' });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Invalid filter values for between operation of min and max. Min \\"z\\" not less than max \\"a\\" (caseInsensitive)"`,
    );
    expect(() => {
      fn(person, { min: 'a', max: 'a' });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Invalid filter values for between operation of min and max. Min \\"a\\" not less than max \\"a\\" (caseInsensitive)"`,
    );
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

  describe('empty values / filters', function() {
    const emptyPerson = { firstName: '' };
    const nullPerson = { firstName: null };
    const undefinedPerson = {};
    const emptyFilter = { name: '' };
    const nullFilter = { name: null };
    const undefinedFilter = {};
    const emptyInFilter = { names: [] };
    const nullInFilter = { names: null };

    test('equals', () => {
      const fn = defineFilter()
        .equals('firstName', 'name')
        .end();
      // No matter the object value, when the filter value is
      // undefined, null, or empty the filter is ignored.
      expect(fn(person, undefinedFilter)).toBe(true);
      expect(fn(emptyPerson, undefinedFilter)).toBe(true);
      expect(fn(nullPerson, undefinedFilter)).toBe(true);
      expect(fn(undefinedPerson, undefinedFilter)).toBe(true);
      expect(fn(person, nullFilter)).toBe(true);
      expect(fn(emptyPerson, nullFilter)).toBe(true);
      expect(fn(nullPerson, nullFilter)).toBe(true);
      expect(fn(undefinedPerson, nullFilter)).toBe(true);
      expect(fn(person, emptyFilter)).toBe(true);
      expect(fn(emptyPerson, emptyFilter)).toBe(true);
      expect(fn(nullPerson, emptyFilter)).toBe(true);
      expect(fn(undefinedPerson, emptyFilter)).toBe(true);
      // Filtering '', null, undefined by 'a' should result in false.
      expect(fn(emptyPerson, { name: 'a' })).toBe(false);
      expect(fn(nullPerson, { name: 'a' })).toBe(false);
      expect(fn(undefinedPerson, { name: 'a' })).toBe(false);
    });

    test('equals strict', () => {
      const fn = defineFilter()
        .equals('firstName', 'name', true)
        .end();
      expect(fn(person, undefinedFilter)).toBe(false);
      expect(fn(person, nullFilter)).toBe(false);
      expect(fn(person, emptyFilter)).toBe(false);
      expect(fn(undefinedPerson, undefinedFilter)).toBe(true);
      expect(fn(nullPerson, nullFilter)).toBe(true);
      expect(fn(emptyPerson, emptyFilter)).toBe(true);
    });

    test('in', () => {
      const fn = defineFilter()
        .in('firstName', 'names')
        .end();
      // No matter the object value, when the filter value is undefined, null,
      // or empty array the filter is ignored
      expect(fn(person, emptyInFilter)).toBe(true);
      expect(fn(person, nullInFilter)).toBe(true);
      expect(fn(person, undefinedFilter)).toBe(true);
      expect(fn(emptyPerson, emptyInFilter)).toBe(true);
      expect(fn(emptyPerson, nullInFilter)).toBe(true);
      expect(fn(emptyPerson, undefinedFilter)).toBe(true);
      expect(fn(nullPerson, emptyInFilter)).toBe(true);
      expect(fn(nullPerson, nullInFilter)).toBe(true);
      expect(fn(nullPerson, undefinedFilter)).toBe(true);
      expect(fn(undefinedPerson, emptyInFilter)).toBe(true);
      expect(fn(undefinedPerson, nullInFilter)).toBe(true);
      expect(fn(undefinedPerson, undefinedFilter)).toBe(true);
      // If the filter value array contains "", null, undefined then the object
      // matches if its value for that field is "", null, undefined respectively
      expect(fn(person, { names: [''] })).toBe(false);
      expect(fn(emptyPerson, { names: [''] })).toBe(true);
      expect(fn(person, { names: [null] })).toBe(false);
      expect(fn(nullPerson, { names: [null] })).toBe(true);
      expect(fn(person, { names: [undefined] })).toBe(false);
      expect(fn(undefinedPerson, { names: [undefined] })).toBe(true);
      // Filtering '', null, undefined by ['a'] should result in false.
      expect(fn(emptyPerson, { names: ['a'] })).toBe(false);
      expect(fn(nullPerson, { names: ['a'] })).toBe(false);
      expect(fn(undefinedPerson, { names: ['a'] })).toBe(false);
    });

    test('in strict', () => {
      const fn = defineFilter()
        .in('firstName', 'names', true)
        .end();
      // When strict and given [], null, undefined nothing can be a member of
      // those empty sets so false should always be returned.
      expect(fn(person, emptyInFilter)).toBe(false);
      expect(fn(person, nullInFilter)).toBe(false);
      expect(fn(person, undefinedFilter)).toBe(false);
      expect(fn(emptyPerson, emptyInFilter)).toBe(false);
      expect(fn(emptyPerson, nullInFilter)).toBe(false);
      expect(fn(emptyPerson, undefinedFilter)).toBe(false);
      expect(fn(nullPerson, emptyInFilter)).toBe(false);
      expect(fn(nullPerson, nullInFilter)).toBe(false);
      expect(fn(nullPerson, undefinedFilter)).toBe(false);
      expect(fn(undefinedPerson, emptyInFilter)).toBe(false);
      expect(fn(undefinedPerson, nullInFilter)).toBe(false);
      expect(fn(undefinedPerson, undefinedFilter)).toBe(false);
    });

    test('startsWith', () => {
      const fn = defineFilter()
        .startsWith('firstName', 'name')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { name: '' })).toBe(true);
      expect(fn(person, { name: null })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { name: '' })).toBe(true);
      expect(fn(emptyPerson, { name: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { name: '' })).toBe(true);
      expect(fn(nullPerson, { name: null })).toBe(true);
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { name: '' })).toBe(true);
      expect(fn(undefinedPerson, { name: null })).toBe(true);
      // Filtering '', null, undefined by startsWith 'a' should result in false.
      expect(fn(emptyPerson, { name: 'a' })).toBe(false);
      expect(fn(nullPerson, { name: 'a' })).toBe(false);
      expect(fn(undefinedPerson, { name: 'a' })).toBe(false);
    });

    test('greaterThan', () => {
      const fn = defineFilter()
        .greaterThan('firstName', 'min')
        .end();
      // No matter the object value, when the filter value is undefined, null,
      // or empty array the filter is ignored
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: '' })).toBe(true);
      expect(fn(person, { min: null })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { min: '' })).toBe(true);
      expect(fn(emptyPerson, { min: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { min: '' })).toBe(true);
      expect(fn(nullPerson, { min: null })).toBe(true);
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { min: '' })).toBe(true);
      expect(fn(undefinedPerson, { min: null })).toBe(true);
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, { min: 'A' })).toBe(false);
      expect(fn(nullPerson, { min: 'A' })).toBe(false);
      expect(fn(emptyPerson, { min: 'A' })).toBe(false);
    });

    test('greaterThan strict', () => {
      const fn = defineFilter()
        .greaterThan('firstName', 'min', true)
        .end();
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, {})).toBe(false);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { min: null })).toBe(false);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { min: null })).toBe(true);
      expect(fn(emptyPerson, { min: '' })).toBe(false);
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: null })).toBe(true);
      expect(fn(person, { min: '' })).toBe(true);
    });

    test('greaterThanOrEquals', () => {
      const fn = defineFilter()
        .greaterThanOrEquals('firstName', 'min')
        .end();
      // No matter the object value, when the filter value is undefined, null,
      // or empty array the filter is ignored
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: '' })).toBe(true);
      expect(fn(person, { min: null })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { min: '' })).toBe(true);
      expect(fn(emptyPerson, { min: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { min: '' })).toBe(true);
      expect(fn(nullPerson, { min: null })).toBe(true);
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { min: '' })).toBe(true);
      expect(fn(undefinedPerson, { min: null })).toBe(true);
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, { min: 'A' })).toBe(false);
      expect(fn(nullPerson, { min: 'A' })).toBe(false);
      expect(fn(emptyPerson, { min: 'A' })).toBe(false);
    });

    test('greaterThanOrEquals strict', () => {
      const fn = defineFilter()
        .greaterThanOrEquals('firstName', 'min', true)
        .end();
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { min: null })).toBe(false);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { min: null })).toBe(true);
      expect(fn(nullPerson, { min: '' })).toBe(false);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { min: null })).toBe(true);
      expect(fn(emptyPerson, { min: '' })).toBe(true);
      expect(fn(emptyPerson, { min: 'A' })).toBe(false);
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: null })).toBe(true);
      expect(fn(person, { min: '' })).toBe(true);
    });

    test('lessThan', () => {
      const fn = defineFilter()
        .lessThan('firstName', 'max')
        .end();
      // No matter the object value, when the filter value is undefined, null,
      // or empty array the filter is ignored
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { max: '' })).toBe(true);
      expect(fn(person, { max: null })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { max: '' })).toBe(true);
      expect(fn(emptyPerson, { max: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { max: '' })).toBe(true);
      expect(fn(nullPerson, { max: null })).toBe(true);
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { max: '' })).toBe(true);
      expect(fn(undefinedPerson, { max: null })).toBe(true);
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, { max: 'A' })).toBe(true);
      expect(fn(nullPerson, { max: 'A' })).toBe(true);
      expect(fn(emptyPerson, { max: 'A' })).toBe(true);
    });

    test('lessThan strict', () => {
      const fn = defineFilter()
        .lessThan('firstName', 'max', true)
        .end();
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, {})).toBe(false);
      expect(fn(undefinedPerson, { max: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(false);
      expect(fn(nullPerson, { max: null })).toBe(false);
      expect(fn(nullPerson, { max: '' })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(false);
      expect(fn(emptyPerson, { max: null })).toBe(false);
      expect(fn(emptyPerson, { max: '' })).toBe(false);
      expect(fn(emptyPerson, { max: 'A' })).toBe(true);
      expect(fn(person, {})).toBe(false);
      expect(fn(person, { max: null })).toBe(false);
      expect(fn(person, { max: '' })).toBe(false);
    });

    test('lessThanOrEquals', () => {
      const fn = defineFilter()
        .lessThanOrEquals('firstName', 'max')
        .end();
      // No matter the object value, when the filter value is undefined, null,
      // or empty array the filter is ignored
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { max: '' })).toBe(true);
      expect(fn(person, { max: null })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { max: '' })).toBe(true);
      expect(fn(emptyPerson, { max: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { max: '' })).toBe(true);
      expect(fn(nullPerson, { max: null })).toBe(true);
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { max: '' })).toBe(true);
      expect(fn(undefinedPerson, { max: null })).toBe(true);
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, { max: 'A' })).toBe(true);
      expect(fn(nullPerson, { max: 'A' })).toBe(true);
      expect(fn(emptyPerson, { max: 'A' })).toBe(true);
    });

    test('lessThanOrEquals strict', () => {
      const fn = defineFilter()
        .lessThanOrEquals('firstName', 'max', true)
        .end();
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { max: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(false);
      expect(fn(nullPerson, { max: null })).toBe(true);
      expect(fn(nullPerson, { max: '' })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(false);
      expect(fn(emptyPerson, { max: null })).toBe(false);
      expect(fn(emptyPerson, { max: '' })).toBe(true);
      expect(fn(emptyPerson, { max: 'A' })).toBe(true);
      expect(fn(person, {})).toBe(false);
      expect(fn(person, { max: null })).toBe(false);
      expect(fn(person, { max: '' })).toBe(false);
    });

    test('between', () => {
      const fn = defineFilter()
        .between('firstName', 'min', 'max')
        .end();
      expect(fn(person, {})).toBe(true);
      expect(fn(person, { min: '', max: 'z' })).toBe(true);
      expect(fn(person, { min: null, max: 'z' })).toBe(true);
      expect(fn(person, { min: 'A', max: '' })).toBe(true);
      expect(fn(person, { min: 'A', max: null })).toBe(true);
      expect(fn(emptyPerson, {})).toBe(true);
      expect(fn(emptyPerson, { min: '', max: 'z' })).toBe(true);
      expect(fn(emptyPerson, { min: null, max: 'z' })).toBe(true);
      expect(fn(emptyPerson, { min: 'A', max: '' })).toBe(true);
      expect(fn(emptyPerson, { min: 'A', max: null })).toBe(true);
      expect(fn(nullPerson, {})).toBe(true);
      expect(fn(nullPerson, { min: '', max: 'z' })).toBe(true);
      expect(fn(nullPerson, { min: null, max: 'z' })).toBe(true);
      expect(fn(nullPerson, { min: 'A', max: '' })).toBe(true);
      expect(fn(nullPerson, { min: 'A', max: null })).toBe(true);
      expect(fn(undefinedPerson, {})).toBe(true);
      expect(fn(undefinedPerson, { min: '', max: 'z' })).toBe(true);
      expect(fn(undefinedPerson, { min: null, max: 'z' })).toBe(true);
      expect(fn(undefinedPerson, { min: 'A', max: '' })).toBe(true);
      expect(fn(undefinedPerson, { min: 'A', max: null })).toBe(true);
      // 'A' > '' > null > undefined
      expect(fn(undefinedPerson, { min: 'A', max: 'z' })).toBe(false);
      expect(fn(nullPerson, { min: 'A', max: 'z' })).toBe(false);
      expect(fn(emptyPerson, { min: 'A', max: 'z' })).toBe(false);
    });

    test('between strict', () => {
      const fn = defineFilter()
        .between('firstName', 'min', 'max', true)
        .end();
      // 'Alex' > 'A'
      expect(fn(person, { min: undefined, max: 'A' })).toBe(false);
      expect(fn(person, { min: undefined, max: 'z' })).toBe(true);
      expect(fn(emptyPerson, { min: '', max: 'z' })).toBe(true);
      expect(fn(emptyPerson, { min: null, max: 'z' })).toBe(true);
      expect(fn(emptyPerson, { min: undefined, max: 'z' })).toBe(true);
      expect(fn(emptyPerson, { min: undefined, max: '' })).toBe(false);
      expect(fn(nullPerson, { min: '', max: 'z' })).toBe(false);
      expect(fn(nullPerson, { min: null, max: 'z' })).toBe(true);
      expect(fn(nullPerson, { min: undefined, max: 'z' })).toBe(true);
      expect(fn(nullPerson, { min: null, max: '' })).toBe(true);
      expect(fn(nullPerson, { min: undefined, max: null })).toBe(false);
      expect(fn(undefinedPerson, { min: null, max: 'z' })).toBe(false);
      expect(fn(undefinedPerson, { min: undefined, max: 'z' })).toBe(true);
      expect(fn(undefinedPerson, { min: undefined, max: null })).toBe(true);
    });

    test('between strict invalid', () => {
      const fn = defineFilter()
        .between('firstName', 'min', 'max', true)
        .end();

      expect(() => {
        fn(person, { min: 'a', max: undefined });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Invalid filter values for between operation of min and max. Min \\"a\\" not less than max undefined"`,
      );

      expect(() => {
        fn(person, { min: 'a', max: '' });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Invalid filter values for between operation of min and max. Min \\"a\\" not less than max \\"\\""`,
      );

      expect(() => {
        fn(person, { min: '', max: null });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Invalid filter values for between operation of min and max. Min \\"\\" not less than max null"`,
      );

      expect(() => {
        fn(person, { min: null, max: undefined });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Invalid filter values for between operation of min and max. Min null not less than max undefined"`,
      );

      expect(() => {
        fn(person, { min: '', max: '' });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Invalid filter values for between operation of min and max. Min \\"\\" not less than max \\"\\""`,
      );
    });
  });
});
