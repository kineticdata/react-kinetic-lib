// Applies fn to each value in list, splitting it into a new list each time fn
// returns a different value.
import { List, OrderedMap } from 'immutable';

export const K = typeof window !== `undefined` ? window.K : () => {};
export const bundle =
  typeof window !== `undefined` && window.bundle
    ? window.bundle
    : {
        apiLocation: () => '/app/api/v1',
        spaceLocation: () => '',
      };

export const splitTeamName = team => {
  const [local, ...parents] = team
    .get('name')
    .split('::')
    .reverse();
  return [parents.reverse().join('::'), local];
};

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

const SUBMISSION_STATIC_BINDINGS = [
  ['Anonymous', 'anonymous'],
  ['Closed At', 'closedAt'],
  ['Closed By', 'closedBy'],
  ['Core State', 'coreState'],
  ['Created At', 'createdAt'],
  ['Created By', 'createdBy'],
  ['Current Page', 'currentPage'],
  ['Id', 'id'],
  ['Session Token', 'sessionToken'],
  ['Submitted At', 'submittedAt'],
  ['Submitted By', 'submittedBy'],
  ['Type', 'type'],
  ['Updated At', 'updatedAt'],
  ['Updated By', 'updatedBy'],
];
const TEAM_STATIC_BINDINGS = [['Name', 'name'], ['Slug', 'slug']];
const USER_STATIC_BINDINGS = [
  ['Display Name', 'displayName'],
  ['Email', 'email'],
  ['Invited By', 'invitedBy'],
  ['Space Admin', 'spaceAdmin'],
  ['Username', 'username'],
];
const FORM_STATIC_BINDINGS = [['Name', 'name'], ['Slug', 'slug']];
const KAPP_STATIC_BINDINGS = [['Name', 'name'], ['Slug', 'slug']];
const SPACE_STATIC_BINDINGS = [['Name', 'name'], ['Slug', 'slug']];

const bindify = (
  fnName,
  staticMap,
  attributeDefinitions = List(),
  attributeTag = 'Attribute',
) =>
  attributeDefinitions.reduce(
    (reduction, attrDef) =>
      reduction.set(attrDef.get('name'), {
        value: `${fnName}('attribute:${attrDef.get('name')}')`,
        tags: [attributeTag],
      }),
    OrderedMap(staticMap).map(value => ({
      value: `${fnName}('${value}')`,
      tags: [],
    })),
  );

export const buildBindings = ({ space, kapp, form, scope }) =>
  OrderedMap([
    [
      'Form',
      {
        children:
          [
            'Datastore Form',
            'Datastore Submission',
            'Form',
            'Submission',
          ].includes(scope) &&
          bindify(
            'form',
            FORM_STATIC_BINDINGS,
            scope.startsWith('Datastore')
              ? space.get('datastoreFormAttributeDefinitions')
              : kapp.get('formAttributeDefinitions'),
          ),
      },
    ],
    [
      'Kapp',
      {
        children:
          ['Kapp', 'Form', 'Submission'].includes(scope) &&
          bindify(
            'kapp',
            KAPP_STATIC_BINDINGS,
            kapp.get('kappAttributeDefinitions'),
          ),
      },
    ],
    [
      'Space',
      {
        children: bindify(
          'space',
          SPACE_STATIC_BINDINGS,
          space.get('spaceAttributeDefinitions'),
        ),
      },
    ],
    [
      'Submission',
      {
        children:
          ['Submission', 'Datastore Submission'].includes(scope) &&
          bindify('submission', SUBMISSION_STATIC_BINDINGS),
      },
    ],
    [
      'Team',
      {
        children:
          scope === 'Team' &&
          bindify(
            'team',
            TEAM_STATIC_BINDINGS,
            space.get('teamAttributeDefinitions'),
          ),
      },
    ],
    [
      'User',
      {
        children:
          scope === 'User' &&
          bindify(
            'user',
            USER_STATIC_BINDINGS,
            space.get('userAttributeDefinitions'),
          ),
      },
    ],
    [
      'Values',
      {
        children:
          ['Submission', 'Datastore Submission'].includes(scope) &&
          (form || kapp) &&
          OrderedMap(
            (form ? form.get('fields') : kapp.get('fields')).map(field => [
              field.get('name'),
              {
                value: `values('${field.get('name')}')`,
                tags: [],
              },
            ]),
          ),
      },
    ],
  ]).filter(o => o.children || o.value);
