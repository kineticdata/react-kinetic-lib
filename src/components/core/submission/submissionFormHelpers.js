import { List } from 'immutable';

// recursively traverses elements list looking for field elements, makes
// recursive call when it encounters a section element
export const getFieldElements = elements =>
  List(elements)
    .flatMap(element =>
      element.type === 'section'
        ? getFieldElements(element.elements)
        : List.of(element),
    )
    .filter(element => element.type === 'field')
    .toArray();
