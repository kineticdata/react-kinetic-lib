// import { Map } from 'immutable';
import moment from 'moment';
import { generateTable } from '../../table/Table';
import { isValueEmpty } from '../../table/Table.redux';
import {
  searchSubmissions,
  SubmissionSearch,
  VALID_DS_CORE_STATES,
  VALID_KAPP_CORE_STATES,
} from '../../../apis';

const processValues = (q, op, field, value, datastore) => {
  if (op === 'startsWith' && datastore) {
    return q.sw(field, value);
  } else if (op === 'gt' && datastore) {
    q.gt(field, value);
  } else if (op === 'gteq' && datastore) {
    q.gteq(field, value);
  } else if (op === 'lt' && datastore) {
    q.lt(field, value);
  } else if (op === 'lteq' && datastore) {
    q.lteq(field, value);
  } else if (op === 'between' && datastore) {
    q.between(field, value.get(0), value.get(1));
  } else if (op === 'equals') {
    return q.eq(field, value);
  }
  return q;
};

const submissionsFilter = (paramData, props) => {
  const { filters, pageSize } = paramData;
  const { include = ['details'], datastore = false } = props;
  const query = new SubmissionSearch(datastore);
  const sortBy = paramData.sortColumn ? paramData.sortColumn : 'createdAt';

  query
    .includes(include)
    .sortBy(sortBy)
    .sortDirection(paramData.sortDirection.toLocaleUpperCase())
    .limit(pageSize);

  filters.reduce((q, filter) => {
    const field = filter.getIn(['column', 'value']);
    const op = filter.getIn(['column', 'filter'], 'equals');
    const value = filter.get('value');

    if (isValueEmpty(value)) {
      return q;
    } else if (field === 'coreState') {
      q.coreState(value);
    } else if (field === 'values') {
      value.reduce(
        (q, f) =>
          processValues(
            q,
            'equals',
            `values[${f.get('field')}]`,
            f.get('value'),
            datastore,
          ),
        q,
      );
    } else if (op === 'startsWith' && datastore) {
      return q.sw(field, value);
    } else if (op === 'gt' && datastore) {
      q.gt(field, value);
    } else if (op === 'gteq' && datastore) {
      q.gteq(field, value);
    } else if (op === 'lt' && datastore) {
      q.lt(field, value);
    } else if (op === 'lteq' && datastore) {
      q.lteq(field, value);
    } else if (op === 'between' && datastore) {
      q.between(field, value.get(0), value.get(1));
    } else if (op === 'between' && field === sortBy) {
      const startDate = moment(value.get(0));
      const endDate = moment(value.get(1));
      if (startDate.isValid()) {
        q.startDate(startDate.toDate());
      }
      if (endDate.isValid()) {
        q.endDate(endDate.toDate());
      }
    } else if (op === 'in') {
      q.in(field, value.toArray());
    } else if (op === 'equals') {
      return q.eq(field, value);
    }
    return q;
  }, query);
  return { search: query.build(), datastore };
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
          kapp: props.kappSlug ? props.kappSlug : null,
          form: formSlug,
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
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'closedBy',
    title: 'closedBy',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'coreState',
    title: 'Core State',
    filter: 'equals',
    type: 'text',
    options: ({ datastore }) =>
      (datastore ? VALID_DS_CORE_STATES : VALID_KAPP_CORE_STATES).map(s => ({
        value: s,
        label: s,
      })),
    sortable: false,
  },
  {
    value: 'createdAt',
    title: 'Created At',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    filter: 'equals',
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
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'submittedBy',
    title: 'Submitted By',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    filter: 'equals',
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

export const SubmissionTable = generateTable({
  tableOptions: ['kappSlug', 'formSlug', 'datastore'],
  columns,
  dataSource,
});

SubmissionTable.displayName = 'SubmissionTable';
export default SubmissionTable;
