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

  between(field, minValue, maxValue) {
    return pushExpression(this, {}, 'bt', field, minValue, maxValue);
  }

  equals(field, value, strict) {
    return pushExpression(this, { strict }, 'eq', field, value);
  }

  greaterThan(field, value) {
    return pushExpression(this, {}, 'gt', field, value);
  }

  greaterThanOrEquals(field, value) {
    return pushExpression(this, {}, 'gte', field, value);
  }

  in(field, values, strict) {
    return pushExpression(this, { strict }, 'in', field, values);
  }

  lessThan(field, value) {
    return pushExpression(this, {}, 'lt', field, value);
  }

  lessThanOrEquals(field, value) {
    return pushExpression(this, {}, 'lte', field, value);
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
  return (object, filters) =>
    (!options.strict && isNullOrEmpty(filters[rvalue])) ||
    normalize(object[lvalue]) === normalize(filters[rvalue]);
};

const greaterThanOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) =>
    isNullOrEmpty(filters[rvalue]) ||
    normalize(object[lvalue]) > normalize(filters[rvalue]);
};

const greaterThanOrEqualsOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) =>
    isNullOrEmpty(filters[rvalue]) ||
    normalize(object[lvalue]) >= normalize(filters[rvalue]);
};

const inOperation = (options, lvalue, rvalue) => {
  const normalize = normalization(options);
  return (object, filters) =>
    (!options.strict && isNullOrEmpty(filters[rvalue])) ||
    (object[lvalue] &&
      isArray(filters[rvalue]) &&
      normalize(filters[rvalue]).includes(normalize(object[lvalue])));
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
