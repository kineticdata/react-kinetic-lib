import { generateTable } from '../../table/Table';
import {
  searchSubmissions,
  SubmissionSearch,
  VALID_DS_CORE_STATES,
} from '../../../apis';
import { List } from 'immutable';

const processValues = (q, v) => {
  const op = v.get('op');
  const part = v.get('part');
  const value = v.get('criteria');

  if (op === 'sw') {
    return q.sw(part, value);
  } else if (op === 'gt') {
    q.gt(part, value);
  } else if (op === 'gteq') {
    q.gteq(part, value);
  } else if (op === 'lt') {
    q.lt(part, value);
  } else if (op === 'lteq') {
    q.lteq(part, value);
  } else if (op === 'between') {
    q.between(part, value.get(0), value.get(1));
  } else if (op === 'eq' && value.size === 1) {
    return q.eq(part, value.get(0));
  } else if (op === 'eq' && value.size > 1) {
    return q.in(part, value.toArray());
  }
  return q;
};

const submissionsFilter = (paramData, props) => {
  const { filters, pageSize } = paramData;
  const { include = ['details'] } = props;
  const query = new SubmissionSearch(true);
  const index = filters.getIn(['index', 'value']);

  query
    .includes(include)
    .index(index)
    .sortDirection(paramData.sortDirection.toLocaleUpperCase())
    .limit(pageSize);

  filters
    .getIn(['values', 'value'])
    .map(v =>
      List.isList(v.get('criteria'))
        ? v.update('criteria', criteria => criteria.filter(cv => cv !== ''))
        : v,
    )
    .reduce((q, v) => processValues(q, v), query);

  return { search: query.build(), datastore: true };
};

const dataSource = props => {
  return {
    fn: searchSubmissions,
    params: paramData => {
      const formSlug = paramData.filters.getIn(['form', 'value'], '')
        ? paramData.filters.getIn(['form', 'value'])
        : props.formSlug;

      return [
        {
          form: formSlug,
          pageToken: paramData.nextPageToken,
          ...submissionsFilter(paramData, props),
        },
      ];
    },
    transform: result => ({
      data: result.submissions,
      nextPageToken: result.nextPageToken,
    }),
  };
};

const columns = [
  {
    value: 'closedAt',
    title: 'Closed At',
    type: 'text',
    sortable: true,
  },
  {
    value: 'closedBy',
    title: 'closedBy',
    type: 'text',
    sortable: false,
  },
  {
    value: 'coreState',
    title: 'Core State',
    filter: 'equals',
    type: 'text',
    options: () =>
      VALID_DS_CORE_STATES.map(s => ({
        value: s,
        label: s,
      })),
    sortable: false,
  },
  {
    value: 'createdAt',
    title: 'Created At',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    type: 'text',
    sortable: false,
  },
  {
    value: 'currentPage',
    title: 'Current Page',
    sortable: false,
  },
  {
    value: 'handle',
    title: 'Handle',
    sortable: false,
  },
  {
    value: 'id',
    title: 'Id',
    sortable: false,
  },
  {
    value: 'label',
    title: 'Label',
    sortable: false,
  },
  {
    value: 'origin',
    title: 'Origin',
    sortable: false,
  },
  {
    value: 'parent',
    title: 'Parent',
    sortable: false,
  },
  {
    value: 'sessionToken',
    title: 'Session Token',
    sortable: false,
  },
  {
    value: 'submittedAt',
    title: 'Submitted At',
    type: 'text',
    sortable: true,
  },
  {
    value: 'submittedBy',
    title: 'Submitted By',
    type: 'text',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    type: 'text',
    sortable: false,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    type: 'text',
    sortable: false,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    type: 'text',
    sortable: false,
  },
  // Used for filtering by values on the fly
  {
    value: 'values',
    title: 'Values',
    sortable: false,
  },
  // Used for filtering by form slug on the fly.
  {
    value: 'form',
    title: 'Form',
    sortable: false,
  },
];

export const DatastoreSubmissionTable = generateTable({
  tableOptions: ['formSlug'],
  columns,
  dataSource,
});

DatastoreSubmissionTable.displayName = 'DatastoreSubmissionTable';
export default DatastoreSubmissionTable;
