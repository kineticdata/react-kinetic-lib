import { generateTable } from '../../table/Table';
import { fetchContexts } from '../../../apis';

const dataSource = ({ datastore, custom }) => ({
  fn: fetchContexts,
  params: paramData => [
    {
      include: 'authorization,details',
      // datastore,
      custom,
      expected: true,
    },
  ],
  transform: result => ({
    // replace if we can pass datastore flag to api
    data: result.contexts.filter(c =>
      custom
        ? c
        : datastore
        ? c.name.startsWith('datastore')
        : !c.name.startsWith('datastore') && !c.name.startsWith('custom'),
    ),
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
];

export const ContextTable = generateTable({
  tableOptions: ['datastore', 'custom'],
  columns,
  dataSource,
});

ContextTable.displayName = 'ContextTable';
ContextTable.defaultProps = {
  columns,
};
