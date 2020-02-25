import React from 'react';

export const OrderedSetLink = ({ type = 'T' }) => (
  <>
    <a
      href="https://immutable-js.github.io/immutable-js/docs/#/OrderedSet"
      target="_blank"
      rel="noopener noreferrer"
    >
      OrderedSet
    </a>
    &lt;{type}&gt;
  </>
);

export const ListLink = ({ type = 'T' }) => (
  <>
    <a
      href="https://immutable-js.github.io/immutable-js/docs/#/List"
      target="_blank"
      rel="noopener noreferrer"
    >
      List
    </a>
    &lt;{type}&gt;
  </>
);
