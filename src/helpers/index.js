// Applies fn to each value in list, splitting it into a new list each time fn
// returns a different value.
import { List } from 'immutable/dist/immutable';

export const partitionListBy = (fn, list) =>
  list.isEmpty()
    ? List()
    : list
        .rest()
        .reduce(
          (reduction, current) =>
            fn(reduction.last().last(), current)
              ? reduction.push(List([current]))
              : reduction.update(reduction.size - 1, list =>
                  list.push(current),
                ),
          List([List([list.first()])]),
        );

export const generateKey = (length = 6) => {
  let result = '';
  while (result.length < length) {
    result =
      result +
      Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
  }
  return result;
};

export const slugify = text =>
  text
    .trim()
    // Convert uppercase to lowercase
    .toLowerCase()
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Remove all non-word chars
    .replace(/[^A-Za-z0-9\u0080-\u00FF-]+/g, '');
