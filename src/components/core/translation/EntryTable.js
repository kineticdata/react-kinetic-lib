import { generateTable } from '../../table/Table';
import { fetchTranslations, fetchStagedTranslations } from '../../../apis';
import { defineFilter } from '../../../helpers';

const clientSide = defineFilter(true)
  .startsWith('locale', 'locale')
  .startsWith('context', 'context')
  .startsWith('key', 'key')
  .startsWith('value', 'translation')
  .end();

const dataSource = ({
  datastore,
  custom,
  staged,
  locale,
  keyHash,
  context,
}) => ({
  fn: staged ? fetchStagedTranslations : fetchTranslations,
  clientSide,
  params: paramData => [
    {
      localeCode: locale && locale,
      keyHash: keyHash && keyHash,
      contextName: context && context,
      include: 'authorization,details',
    },
  ],
  transform: result => ({
    data: staged ? result.changes : result.entries,
    nextPageToken: result.nextPageToken,
  }),
});

const filters = () => () => [
  { name: 'locale', label: 'Locale', type: 'text' },
  { name: 'context', label: 'Context', type: 'text' },
  { name: 'key', label: 'Key', type: 'text' },
  { name: 'translation', label: 'Translation', type: 'text' },
];

const columns = [
  {
    value: 'locale',
    title: 'Locale',
    sortable: true,
  },
  {
    value: 'context',
    title: 'Context',
    sortable: true,
  },
  {
    value: 'key',
    title: 'Key',
    sortable: true,
  },
  {
    value: 'value',
    title: 'Translation',
    sortable: true,
  },
];

export const EntryTable = generateTable({
  tableOptions: ['datastore', 'staged', 'locale', 'keyHash', 'context'],
  columns,
  filters,
  dataSource,
});

EntryTable.displayName = 'EntryTable';
EntryTable.defaultProps = {
  columns,
};
