import { List, Range } from 'immutable';
import { generateTable } from '../../table/Table';
import { fetchForm, searchSubmissions } from '../../../apis';
import { defineKqlQuery } from '../../../helpers';
import { generatePaginationParams } from '../../../apis/http';

const dataSource = ({ formSlug }) => ({
  fn: searchSubmissions,
  params: paramData => [
    {
      datastore: true,
      form: formSlug,
      search: {
        direction: paramData.sortDirection,
        include: ['details'],
        index: paramData.filters.getIn(['query', 'index']),
        // need to pass undefined instead of null so the `q` parameter is not
        // added to the query string with empty value
        q: paramData.filters.getIn(['query', 'q']) || undefined,
        ...generatePaginationParams(paramData),
      },
    },
  ],
  transform: result => ({
    data: result.submissions,
    nextPageToken: result.nextPageToken,
  }),
});

const filterDataSources = ({ formSlug }) => ({
  form: {
    fn: fetchForm,
    params: [{ datastore: true, formSlug, include: 'indexDefinitions' }],
    transform: result => result.form,
  },
  indexOptions: {
    fn: form =>
      form
        .get('indexDefinitions')
        .map(indexDefinition => ({
          label: indexDefinition.get('name'),
          value: indexDefinition.get('name'),
        }))
        .toArray(),
    params: ({ form }) => form && [form],
  },
  maxLength: {
    fn: form =>
      form
        .get('indexDefinitions')
        .map(indexDefinition => indexDefinition.get('parts').size)
        .max(),
    params: ({ form }) => form && [form],
  },
  selectedIndexDefinition: {
    fn: (form, index) =>
      form
        .get('indexDefinitions')
        .find(indexDefinition => indexDefinition.get('name') === index),
    params: ({ form, values }) => values && [form, values.get('index')],
  },
});

const getOperatorIndex = name => {
  const match = name.match(/op(\d+)-operator/);
  return match && parseInt(match[1]);
};

const operatorChangeFn = i => ({ values }, { setValue }) => {
  const value = values.get(`op${i}-operator`);
  // If the operator was set to something besides 'eq' or 'in' clear any
  // operators after this. Their change events will then fire and clear the
  // corresponding operands.
  if (!['equals', 'in'].includes(value)) {
    values
      .filter((value, name) => getOperatorIndex(name) > i)
      .forEach((_value, name) => setValue(name, ''));
  }
  // If the operator was set to '' and the first operand is set, clear it.
  if (!value && values.get(`op${i}-operand1`)) {
    setValue(`op${i}-operand1`, '');
  }
  // If the operator is not 'bt' and the second operand is set, clear it.
  if (value !== 'between' && values.get(`op${i}-operand2`)) {
    setValue(`op${i}-operand2`, '');
  }
  // If the operator is not 'in and the third operand is set, clear it.
  if (value !== 'in' && !values.get(`op${i}-operand3`).isEmpty()) {
    setValue(`op${i}-operand3`, List());
  }
};

const enabledFn = i => ({ values }) =>
  Range(0, i, -1)
    .map(i => values.get(`op${i}-operator`))
    .every(value => ['equals', 'in'].includes(value));

const visibleFn = (i, operatorType) => ({ selectedIndexDefinition, values }) =>
  selectedIndexDefinition &&
  i < selectedIndexDefinition.get('parts').size &&
  (!operatorType || values.get(`op${i}-operator`) === operatorType);

const serializeQuery = ({ selectedIndexDefinition, values }) => ({
  index: values.get('index'),
  q: selectedIndexDefinition
    .get('parts')
    .reduce((query, part, i) => {
      const op = values.get(`op${i}-operator`);
      return op === 'between'
        ? query.between(part, `op${i}-operand1`, `op${i}-operand2`)
        : op === 'in'
        ? query.in(part, `op${i}-operand3`)
        : op
        ? query[op](part, `op${i}-operand1`)
        : query;
    }, defineKqlQuery())
    .end()(values.toJS()),
});

const filters = () => ({ form, indexOptions, maxLength }) =>
  form &&
  indexOptions &&
  maxLength && [
    {
      label: 'Search By',
      initialValue: indexOptions.first().get('value'),
      name: 'index',
      options: indexOptions,
      transient: true,
      type: 'select',
    },
    ...Range(0, maxLength)
      .flatMap(i => [
        {
          enabled: enabledFn(i),
          name: `op${i}-operator`,
          type: 'select',
          visible: visibleFn(i),
          onChange: operatorChangeFn(i),
          options: [
            { label: '=', value: 'equals' },
            { label: 'in', value: 'in' },
            { label: '>', value: 'greaterThan' },
            { label: '>=', value: 'greaterThanOrEquals' },
            { label: '<', value: 'lessThan' },
            { label: '<=', value: 'lessThanOrEquals' },
            { label: 'between', value: 'between' },
            { label: 'startsWith', value: 'startsWith' },
          ],
          transient: true,
        },
        {
          enabled: enabledFn(i),
          name: `op${i}-operand1`,
          transient: true,
          type: 'text',
          visible: visibleFn(i),
        },
        {
          enabled: enabledFn(i),
          name: `op${i}-operand2`,
          transient: true,
          type: 'text',
          visible: visibleFn(i, 'between'),
        },
        {
          enabled: enabledFn(i),
          name: `op${i}-operand3`,
          transient: true,
          type: 'text-multi',
          visible: visibleFn(i, 'in'),
        },
      ])
      .toArray(),
    {
      name: 'query',
      type: null,
      serialize: serializeQuery,
    },
  ];

const columns = [
  {
    value: 'closedAt',
    title: 'Closed At',
    sortable: true,
  },
  {
    value: 'closedBy',
    title: 'closedBy',
    sortable: false,
  },
  {
    value: 'coreState',
    title: 'Core State',
    sortable: false,
  },
  {
    value: 'createdAt',
    title: 'Created',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
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
    sortable: true,
  },
  {
    value: 'submittedBy',
    title: 'Submitted By',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    sortable: false,
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    sortable: false,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    sortable: false,
  },
];

export const DatastoreSubmissionTable = generateTable({
  tableOptions: ['formSlug'],
  columns,
  dataSource,
  filters,
  filterDataSources,
});

DatastoreSubmissionTable.displayName = 'DatastoreSubmissionTable';
export default DatastoreSubmissionTable;
