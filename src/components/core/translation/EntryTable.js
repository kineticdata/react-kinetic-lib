import { generateTable } from '../../table/Table';
import { fetchTranslations, fetchStagedTranslations } from '../../../apis';

const dataSource = ({ datastore, custom, staged }) => ({
  fn: staged ? fetchStagedTranslations : fetchTranslations,
  params: paramData => [
    {
      include: 'authorization,details',
    },
  ],
  transform: result => ({
    data: staged ? result.changes : result.entries,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'locale',
    title: 'Locale',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'key',
    title: 'Key',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'value',
    title: 'Translation',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
];

export const EntryTable = generateTable({
  tableOptions: ['datastore', 'staged'],
  columns,
  dataSource,
});

EntryTable.displayName = 'EntryTable';
EntryTable.defaultProps = {
  columns,
};
