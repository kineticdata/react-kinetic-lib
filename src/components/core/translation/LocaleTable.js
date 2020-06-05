import { generateTable } from '../../table/Table';
import { fetchEnabledLocales } from '../../../apis';

const dataSource = () => ({
  fn: fetchEnabledLocales,
  params: paramData => [
    {
      include: 'authorization,details',
    },
  ],
  transform: result => ({
    data: result.locales,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'code',
    title: 'Code',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
];

export const LocaleTable = generateTable({
  columns,
  dataSource,
});

LocaleTable.displayName = 'LocaleTable';
