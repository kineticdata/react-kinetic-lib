import {
  isArray,
  isEmpty,
  isString,
  constant,
  every,
  last,
  map,
  some,
} from 'lodash-es';

const defineKqlQuery = () => new SearchBuilder('kql');
const defineFilter = (caseInsensitive, rootOperator) =>
  new SearchBuilder('filter', caseInsensitive, rootOperator);

class SearchBuilder {
  constructor(type, caseInsensitive = false, rootOperator = 'and') {
    this.caseInsensitive = caseInsensitive;
    this.type = type;
    this.rootExpression = { operator: rootOperator, operands: [] };
    this.expressionStack = [this.rootExpression];
  }

  and() {
    return pushExpression(this, {}, 'and');
  }

  between(field, minValue, maxValue, strict) {
    return pushExpression(this, { strict }, 'bt', field, minValue, maxValue);
  }

  equals(field, value, strict) {
    return pushExpression(this, { strict }, 'eq', field, value);
  }

  greaterThan(field, value, strict) {
    return pushExpression(this, { strict }, 'gt', field, value);
  }

  greaterThanOrEquals(field, value, strict) {
    return pushExpression(this, { strict }, 'gte', field, value);
  }

  in(field, values, strict) {
    return pushExpression(this, { strict }, 'in', field, values);
  }

  lessThan(field, value, strict) {
    return pushExpression(this, { strict }, 'lt', field, value);
  }

  lessThanOrEquals(field, value, strict) {
    return pushExpression(this, { strict }, 'lte', field, value);
  }

  or() {
    return pushExpression(this, {}, 'or');
  }

  startsWith(field, value) {
    return pushExpression(this, {}, 'sw', field, value);
  }

  end() {
    if (this.expressionStack.length === 1) {
      return this.type === 'kql' ? '' : compileExpression(this.rootExpression);
    } else {
      this.expressionStack.pop();
      return this;
    }
  }
}

// This could be a method of SearchBuilder but we don't have a way to make it
// private so its here...
// The last entry in expressionStack will always be an 'and' / 'or' operation,
// so we push the given expression to the end of that one. Then if the given
// expression is another 'and' / 'or' operation we push the new expression
// to the expression stack and subsequent expressions will be added to that one.
const pushExpression = (self, options, operator, ...operands) => {
  const currentExpression = last(self.expressionStack);
  currentExpression.operands.push({
    operator,
    operands,
    options: { caseInsensitive: self.caseInsensitive, ...options },
  });
  if (['and', 'or'].includes(operator)) {
    self.expressionStack.push(last(currentExpression.operands));
  }
  return self;
};

const compileExpression = ({ operator, operands, options }) => {
  switch (operator) {
    case 'and':
      return andOperation(operands);
    case 'bt':
      return betweenOperation(options, ...operands);
    case 'eq':
      return equalsOperation(options, ...operands);
    case 'gt':
      return greaterThanOperation(options, ...operands);
    case 'gte':
      return greaterThanOrEqualsOperation(options, ...operands);
    case 'in':
      return inOperation(options, ...operands);
    case 'lt':
      return lessThanOperation(options, ...operands);
    case 'lte':
      return lessThanOrEqualsOperation(options, ...operands);
    case 'or':
      return orOperation(operands);
    case 'sw':
      return startsWithOperation(options, ...operands);
    default:
      return constant(true);
  }
};

const andOperation = expressions => {
  const fns = map(expressions, compileExpression);
  return (object, filters) => every(fns, fn => fn(object, filters));
};

const orOperation = expressions => {
  const fns = map(expressions, compileExpression);
  return (object, filters) => some(fns, fn => fn(object, filters));
};

const betweenOperation = (options, lvalue, rvalueMin, rvalueMax) => {
  const normalize = normalization(options);
  return (object, filters) =>
    isNullOrEmpty(filters[rvalueMin]) ||
    isNullOrEmpty(filters[rvalueMax]) ||
    (normalize(object[lvalue]) >= normalize(filters[rvalueMin]) &&
      normalize(object[lvalue]) < normalize(filters[rvalueMax]));
};

const equalsOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) => {
    // Do not apply filter when the filter value is empty and strict is not set.
    if (isNullOrEmpty(filters[rvalue]) && !options.strict) {
      return true;
    }
    return normalize(object[lvalue]) === normalize(filters[rvalue]);
  };
};

const greaterThanOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) => {
    const left = object[lvalue];
    const right = filters[rvalue];
    // If the filter value is empty and strict is not enabled we skip the filter
    // by returning true.
    if (isNullOrEmpty(right) && !options.strict) {
      return true;
    }
    if (left && right) {
      return normalize(object[lvalue]) > normalize(filters[rvalue]);
    }
    return compareFalsy(left, right) < 0;
  };
};

const greaterThanOrEqualsOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) => {
    const left = object[lvalue];
    const right = filters[rvalue];
    // If the filter value is empty and strict is not enabled we skip the filter
    // by returning true.
    if (isNullOrEmpty(right) && !options.strict) {
      return true;
    }
    if (left && right) {
      return normalize(object[lvalue]) >= normalize(filters[rvalue]);
    }
    return compareFalsy(left, right) <= 0;
  };
};

const inOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) => {
    // If the filter value is [], null, undefined then we check for the strict
    // option, if strict always return false and if not strict always return
    // true (because we are effectively skipping this filter operation).
    if (isNullOrEmpty(filters[rvalue]) && !isString(filters[rvalue])) {
      return !options.strict;
    }
    // If we got a non-empty filter value that isn't an array (like a string)
    // we throw an error.
    if (!isArray(filters[rvalue])) {
      throw new Error(
        `Invalid filter value for in operation of ${rvalue} filter. Got ${JSON.stringify(
          filters[rvalue],
        )}. Require an array.`,
      );
    }
    // Finally perform the operation by checking the filter value for membership
    // of the object value.
    return normalize(filters[rvalue]).includes(normalize(object[lvalue]));
  };
};

const lessThanOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) =>
    isNullOrEmpty(filters[rvalue]) ||
    normalize(object[lvalue]) < normalize(filters[rvalue]);
};

const lessThanOrEqualsOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) =>
    isNullOrEmpty(filters[rvalue]) ||
    normalize(object[lvalue]) <= normalize(filters[rvalue]);
};

const startsWithOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) =>
    isNullOrEmpty(filters[rvalue]) ||
    (object[lvalue] &&
      normalize(object[lvalue]).startsWith(normalize(filters[rvalue])));
};

// Helper that normalizes comparing values when one or both of the values is
// falsy. Our convention is (any truthy) > '' > null > undefined;
const compareFalsy = (left, right) => {
  const falsyRanks = [undefined, null, ''];
  const leftRank = !left ? falsyRanks.indexOf(left) : 3;
  const rightRank = !right ? falsyRanks.indexOf(right) : 3;
  return rightRank > leftRank ? 1 : rightRank === leftRank ? 0 : -1;
};

const normalization = options => (options.caseInsensitive ? toLower : identity);

const isNullOrEmpty = value =>
  (isString(value) && isEmpty(value)) ||
  (isArray(value) && isEmpty(value)) ||
  value === null ||
  value === undefined;

const toLower = value =>
  isString(value)
    ? value.toLocaleLowerCase()
    : isArray(value)
    ? value.map(toLower)
    : value;

const identity = v => v;

export { defineKqlQuery, defineFilter };
